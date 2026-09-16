package repository

import (
	"media-sequencer/internal/domain"
)

func GetAllMedia() ([]domain.Media, error) {
	var media []domain.Media
	result := DB.Find(&media)
	return media, result.Error
}

func CreateMedia(media *domain.Media) error {
	return DB.Create(media).Error
}

func GetMediaByID(id uint) (*domain.Media, error) {
	var media domain.Media
	result := DB.First(&media, id)
	return &media, result.Error
}
