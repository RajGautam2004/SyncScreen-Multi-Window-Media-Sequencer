# Multi-Window Media Sequencer

https://syncscreen-multi-window-media-sequencer.onrender.com/

A production-ready platform to synchronize and broadcast media playlists across multiple display windows. It features a deterministic time-based playback engine and a global sync override feature that flawlessly interrupts and resumes playback down to the exact millisecond.

---

## 1. Project Overview
This project consists of a high-performance **Golang/Gin backend** orchestrating real-time media scheduling, and a modern **React/Vite frontend** serving as both the multi-screen dashboard and the administrative control panel. The system is designed for environments like digital signage, museum exhibits, or retail displays where multiple screens need tightly coordinated media loops and instant, synchronized overrides.

## 2. Features
- **Deterministic Time-Based Playback:** Media playback isn't calculated via error-prone frontend timers or backend sleep loops. It's calculated mathematically against a central logical clock.
- **Global Sync Override:** Instantly interrupt all active displays to broadcast a specific media file simultaneously.
- **Flawless Resume:** When the sync override expires, all displays perfectly resume their original sequence from the exact second they were interrupted.
- **Native WebSockets:** Real-time, instant communication to update UI states with zero polling overhead.
- **Clean Architecture:** Strict separation of concerns (Domain, Repository, Service, Scheduler, Handler) for scalability.
- **Premium UI:** A sleek, glassmorphic dark-mode dashboard with subtle micro-animations.

---

## 3. Architecture

The system uses a persistent connection model. The Golang backend mathematically determines what should be playing, and pushes those state changes instantly to the React frontend.

### Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend [React Application]
        A[Dashboard Pages] --> B[WindowCards]
        A --> C[Admin Panel]
    end

    subgraph Backend [Golang Application]
        D[Gin HTTP Router]
        E[Gorilla WebSocket Hub]
        F[Deterministic Scheduler]
    end

    subgraph Database [PostgreSQL]
        G[(Neon / Local DB)]
    end

    %% Connections
    C -- "HTTP POST (Add Media/Sync)" --> D
    D -- "Read/Write" --> G
    
    F -- "Calculate Playback Time" --> F
    F -- "Fetch Playlists" --> G
    
    F -- "Push State Changes" --> E
    E -- "ws:// events" --> B
```

---

## 4. Folder Structure

```text
/
├── cmd/
│   └── server/main.go       # Go application entry point
├── configs/                 # Environment variable parsing
├── internal/
│   ├── domain/              # Core GORM models (Media, Window, Playlist)
│   ├── handler/             # Gin REST endpoints and CORS config
│   ├── repository/          # PostgreSQL database operations
│   ├── scheduler/           # The deterministic playback engine
│   └── websocket/           # Native WS Hub and Event structs
├── migrations/              # Database seed logic
├── frontend/                # React Vite Application
│   ├── src/
│   │   ├── components/      # UI Elements (MediaRenderer, SyncPanel, etc)
│   │   ├── hooks/           # useWebSocket.js hook
│   │   ├── pages/           # Dashboard & Admin views
│   │   └── services/        # Axios API wrapper
├── docker-compose.yml       # Local Docker orchestration
├── Dockerfile               # Backend multi-stage build
├── frontend/Dockerfile      # Frontend Nginx build
├── render.yaml              # Render.com IaC config
└── frontend/vercel.json     # Vercel deployment config
```

---

## 5. API Documentation

### GET `/windows`
Retrieves all configured display windows.
**Response:**
```json
[
  {
    "id": 1,
    "name": "Window A",
    "currentMediaId": 0,
    "playbackStartTime": 0
  }
]
```

### GET `/media`
Retrieves the media library.
**Response:**
```json
[
  {
    "id": 1,
    "title": "Promo Video",
    "type": "video",
    "url": "https://example.com/promo.mp4",
    "durationSeconds": 20
  }
]
```

### POST `/media`
Creates a new media asset.
**Request:**
```json
{
  "title": "Blank Screen",
  "type": "blank",
  "url": "",
  "durationSeconds": 5
}
```

### POST `/playlist/add`
Assigns a media item to a window's playlist at a specific sequence order.
**Request:**
```json
{
  "windowId": 1,
  "mediaId": 1,
  "sequenceOrder": 1
}
```

### POST `/sync`
Triggers a global synchronization override.
**Request:**
```json
{
  "mediaId": 2,
  "duration": 15
}
```
**Response:**
```json
{
  "status": "sync started"
}
```

---

## 6. WebSocket Events

The frontend connects to `ws://[BACKEND_URL]/ws` and listens to the following JSON payloads:

- **`window_state`**: Emitted when a new media starts playing on a specific window, or when resuming after a sync.
  ```json
  {"type": "window_state", "windowId": 1, "media": {...}, "position": 0}
  ```
- **`playlist_updated`**: Emitted when the admin panel alters a playlist.
- **`sync_started`**: Emitted to all clients instantly when `/sync` is triggered.
  ```json
  {"type": "sync_started", "media": {...}, "duration": 15}
  ```
- **`sync_ended`**: Emitted to all clients when the global sync duration expires.

---

## 7. Database Schema

- **Window:** `id` (PK), `name`
- **Media:** `id` (PK), `title`, `type` (image/video/blank), `url`, `duration_seconds`
- **PlaylistItem (Mapping):** `id` (PK), `window_id` (FK), `media_id` (FK), `sequence_order`

---

## 8. Setup & Deployment

### Setup Locally (Without Docker)
1. Ensure PostgreSQL is running. Adjust `.env` connection string.
2. Root directory: `go run cmd/server/main.go`
3. Frontend directory: `npm install && npm run dev`

### Docker Setup
Run the entire stack (Database, Backend, Frontend) with a single command:
```bash
docker-compose up --build
```
- Backend available at `localhost:8000`
- Frontend available at `localhost:3000`

### Deployment
1. **Database:** Create a Neon PostgreSQL instance.
2. **Backend (Render):** Connect this repo to Render. It will automatically detect `render.yaml`. Set `DATABASE_URL` in the Render dashboard.
3. **Frontend (Vercel):** Import the `frontend` folder to Vercel. Set the `VITE_API_URL` environment variable to your Render URL.

### Environment Variables (`.env.example`)
```env
# Backend
DATABASE_DSN="host=localhost user=postgres password=password dbname=media_sequencer port=5432 sslmode=disable"
DATABASE_URL="postgres://user:pass@neon-host/dbname?sslmode=require" # For Production
PORT=8000

# Frontend
VITE_API_URL="http://localhost:8000" # Set to backend URL in Vercel
```

---

## 9. Assumptions & Tradeoffs

- **Memory vs DB Polling:** The scheduler currently fetches the playlist from the DB frequently. **Tradeoff:** This ensures the sequence instantly updates when the Admin changes it, at the cost of slightly higher DB load. In a massive scale environment, caching would be implemented.
- **Media Buffering:** The system assumes frontend network speeds are sufficient to load videos before their scheduled time. **Tradeoff:** No pre-caching mechanism is built into the React app to pre-load upcoming media.
- **Blank Screens:** Blank screens are treated as literal media items (with `type: "blank"` and no URL) rather than a lack of data, ensuring they respect the sequence rules perfectly.

---

## 10. Simple Explanation for Non-Technical Users

### What is a playlist?
Think of a playlist exactly like a music playlist on Spotify, but for visual screens. It is simply a predefined list of images, videos, or scheduled blank screens that tell a specific window exactly what to show and in what order.

### Why a 5-hour cycle?
Imagine a museum exhibit that is open for 5 hours. We want the content to loop continuously without anyone needing to press "play" again. The 5-hour cycle is just the mathematical "reset point" for the underlying clock to ensure everything repeats reliably forever without getting out of sync.

### How does "Sync" work?
Imagine an emergency broadcast or a special announcement that needs to be seen immediately on every TV in a building. When you press "Sync", the backend sends an instant lightning-fast message to all screens. They immediately drop what they are doing and play the special announcement for the time you specified. 

### How do windows resume playback exactly where they left off?
Imagine you are watching a 20-second video, and at 12 seconds, someone pauses it to show you a commercial. Our system has a "Global Pause Button". When the commercial (sync) starts, the system pauses the underlying timeline clock for everyone. When the commercial ends, it unpauses the clock. Because the clock was frozen, the 20-second video resumes flawlessly at exactly 12 seconds, as if the commercial never happened!

### Why was Golang chosen for the backend?
Golang (or Go) is incredibly fast and famously good at juggling multiple tasks at the exact same time (concurrency). Since this application requires a "Scheduler" that must calculate time continuously in the background while simultaneously blasting out real-time WebSocket messages to dozens of screens, Go's speed and efficiency make it the absolute perfect tool for the job.
