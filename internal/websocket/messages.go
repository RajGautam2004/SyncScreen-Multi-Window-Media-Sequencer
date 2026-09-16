package websocket

import "media-sequencer/internal/domain"

// WindowStateMsg is sent when the playback state of a window changes
type WindowStateMsg struct {
	Type     string       `json:"type"`     // "window_state"
	WindowID uint         `json:"windowId"` // The ID of the window
	Media    domain.Media `json:"media"`    // The media item currently playing
	Position int          `json:"position"` // The resume offset in seconds (e.g., 12s if interrupted at 12s)
}

// PlaylistUpdatedMsg is sent when a window's playlist changes
type PlaylistUpdatedMsg struct {
	Type     string `json:"type"`     // "playlist_updated"
	WindowID uint   `json:"windowId"` // The window whose playlist updated
}

// SyncStartedMsg is broadcasted to all windows when a sync media begins
type SyncStartedMsg struct {
	Type     string       `json:"type"`     // "sync_started"
	Media    domain.Media `json:"media"`    // The temporary sync media to play
	Duration int          `json:"duration"` // How long the sync media should play in seconds
}

// SyncEndedMsg is broadcasted when the sync duration expires
type SyncEndedMsg struct {
	Type string `json:"type"` // "sync_ended"
}
