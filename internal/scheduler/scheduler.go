package scheduler

import (
	"encoding/json"
	"sync"
	"time"

	"media-sequencer/internal/domain"
	"media-sequencer/internal/repository"
	ws "media-sequencer/internal/websocket"
)

var (
	hub               *ws.Hub
	mu                sync.Mutex
	syncActive        bool
	syncEndTime       time.Time
	globalPauseOffset int64 // Tracks total seconds the timeline was paused during syncs
	syncStartTime     time.Time
	
	// Track what each window is currently playing to detect when we need to broadcast a change
	lastKnownState map[uint]ws.WindowStateMsg
)

const cycleDurationSeconds int64 = 18000 // 5 hours

func InitScheduler(h *ws.Hub) {
	hub = h
	lastKnownState = make(map[uint]ws.WindowStateMsg)

	// Start the deterministic ticker
	go runScheduler()
}

// TriggerSync pauses the normal deterministic timeline and broadcasts a temporary sync media.
// Algorithm:
// 1. Mark sync as active and calculate when it should end.
// 2. Save the exact timestamp the sync started so we can calculate the pause duration later.
// 3. Broadcast a 'sync_started' event to all windows.
func TriggerSync(media domain.Media, durationSeconds int) {
	mu.Lock()
	defer mu.Unlock()

	syncActive = true
	syncStartTime = time.Now()
	syncEndTime = time.Now().Add(time.Duration(durationSeconds) * time.Second)

	msg := ws.SyncStartedMsg{
		Type:     "sync_started",
		Media:    media,
		Duration: durationSeconds,
	}
	b, _ := json.Marshal(msg)
	hub.Broadcast <- b
}

func runScheduler() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		<-ticker.C
		mu.Lock()

		if syncActive {
			// Check if the sync duration has expired
			if time.Now().After(syncEndTime) {
				// Algorithm:
				// When sync ends, we calculate exactly how many seconds it was active.
				// We add this duration to the 'globalPauseOffset'.
				// Because our logical time is (RealTime - PauseOffset), adding the sync duration
				// to the offset effectively "rewinds" the logical time, resuming exactly from the interrupted point.
				pauseDuration := int64(time.Since(syncStartTime).Seconds())
				globalPauseOffset += pauseDuration
				syncActive = false

				// Broadcast that sync has ended
				endMsg := ws.SyncEndedMsg{Type: "sync_ended"}
				b, _ := json.Marshal(endMsg)
				hub.Broadcast <- b

				// Force recalculate and broadcast the resumed state
				updatePlaylists(true)
			}
		} else {
			// If no sync is active, calculate standard deterministic playback
			updatePlaylists(false)
		}

		mu.Unlock()
	}
}

// updatePlaylists deterministically calculates what every window should be playing.
// Algorithm:
// 1. Calculate LogicalTime = CurrentTime - Total Paused Time.
// 2. CycleTime = LogicalTime % 18000s (5-hour repeating cycle).
// 3. For each window, retrieve its playlist and total duration.
// 4. PlaylistTime = CycleTime % TotalPlaylistDuration.
// 5. Iterate through the playlist items, accumulating their durations.
// 6. When the accumulated duration exceeds PlaylistTime, we have found the current media.
// 7. Calculate 'Position' = PlaylistTime - AccumulatedDurationBeforeThisMedia.
func updatePlaylists(forceBroadcast bool) {
	windows, err := repository.GetAllWindows()
	if err != nil {
		return
	}

	currentTime := time.Now().Unix()
	logicalTime := currentTime - globalPauseOffset
	cycleTime := logicalTime % cycleDurationSeconds

	for _, w := range windows {
		items, err := repository.GetPlaylistForWindow(w.ID)
		if err != nil || len(items) == 0 {
			continue
		}

		// Calculate total duration of this window's playlist
		var totalDuration int64 = 0
		var mediaCache = make(map[uint]*domain.Media)
		for _, item := range items {
			media, err := repository.GetMediaByID(item.MediaID)
			if err == nil {
				mediaCache[item.ID] = media
				totalDuration += int64(media.DurationSeconds)
			}
		}

		if totalDuration == 0 {
			continue
		}

		// Calculate exact position within the looping playlist
		playlistTime := cycleTime % totalDuration

		var accumulatedTime int64 = 0
		var currentMedia *domain.Media
		var position int

		// Find which media corresponds to the current playlistTime
		for _, item := range items {
			media := mediaCache[item.ID]
			if media == nil {
				continue
			}

			if accumulatedTime+int64(media.DurationSeconds) > playlistTime {
				currentMedia = media
				position = int(playlistTime - accumulatedTime)
				break
			}
			accumulatedTime += int64(media.DurationSeconds)
		}

		if currentMedia != nil {
			newState := ws.WindowStateMsg{
				Type:     "window_state",
				WindowID: w.ID,
				Media:    *currentMedia,
				Position: position,
			}

			// Broadcast if it's a forced update (e.g., after sync) or if the media changed
			lastState, exists := lastKnownState[w.ID]
			
			// We broadcast if the media ID changes. We don't broadcast every second to update 'position'
			// because the frontend player natively handles the time passing. We only send 'position'
			// when a new media starts, or when resuming from sync.
			if forceBroadcast || !exists || lastState.Media.ID != currentMedia.ID {
				lastKnownState[w.ID] = newState
				b, _ := json.Marshal(newState)
				hub.Broadcast <- b
			}
		}
	}
}
