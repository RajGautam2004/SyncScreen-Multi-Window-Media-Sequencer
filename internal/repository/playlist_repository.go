package repository

import (
	"media-sequencer/internal/domain"
)

func GetPlaylistForWindow(windowID uint) ([]domain.PlaylistItem, error) {
	var items []domain.PlaylistItem
	result := DB.Where("window_id = ?", windowID).Order("sequence_order asc").Find(&items)
	return items, result.Error
}

func AddToPlaylist(item *domain.PlaylistItem) error {
	return DB.Create(item).Error
}
