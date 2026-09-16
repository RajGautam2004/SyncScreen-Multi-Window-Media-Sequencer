package repository

import (
	"media-sequencer/internal/domain"
)

func GetAllWindows() ([]domain.Window, error) {
	var windows []domain.Window
	result := DB.Find(&windows)
	return windows, result.Error
}

func CreateWindow(window *domain.Window) error {
	return DB.Create(window).Error
}

func GetWindowByID(id uint) (*domain.Window, error) {
	var window domain.Window
	result := DB.First(&window, id)
	return &window, result.Error
}

func UpdateWindow(window *domain.Window) error {
	return DB.Save(window).Error
}
