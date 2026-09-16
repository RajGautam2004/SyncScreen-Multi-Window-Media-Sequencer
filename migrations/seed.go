package migrations

import (
	"media-sequencer/internal/domain"
	"media-sequencer/internal/repository"
)

func SeedDatabase() {
	windows := []domain.Window{
		{Name: "Window A"},
		{Name: "Window B"},
		{Name: "Window C"},
	}

	for i := range windows {
		_ = repository.CreateWindow(&windows[i])
	}

	medias := []domain.Media{
		{Title: "M1", Type: "image", URL: "http://example.com/m1.jpg", DurationSeconds: 10},
		{Title: "M2", Type: "video", URL: "http://example.com/m2.mp4", DurationSeconds: 20},
		{Title: "M3", Type: "image", URL: "http://example.com/m3.jpg", DurationSeconds: 15},
		{Title: "M4", Type: "video", URL: "http://example.com/m4.mp4", DurationSeconds: 25},
		{Title: "M5", Type: "image", URL: "http://example.com/m5.jpg", DurationSeconds: 10},
		{Title: "M6", Type: "image", URL: "http://example.com/m6.jpg", DurationSeconds: 30},
		{Title: "Blank", Type: "blank", URL: "", DurationSeconds: 5},
	}

	for i := range medias {
		_ = repository.CreateMedia(&medias[i])
	}

	playlists := []domain.PlaylistItem{
		{WindowID: 1, MediaID: 1, SequenceOrder: 1},
		{WindowID: 1, MediaID: 2, SequenceOrder: 2},
		{WindowID: 1, MediaID: 3, SequenceOrder: 3},

		{WindowID: 2, MediaID: 4, SequenceOrder: 1},
		{WindowID: 2, MediaID: 5, SequenceOrder: 2},

		{WindowID: 3, MediaID: 6, SequenceOrder: 1},
		{WindowID: 3, MediaID: 7, SequenceOrder: 2},
	}

	for i := range playlists {
		_ = repository.AddToPlaylist(&playlists[i])
	}
}
