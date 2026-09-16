package repository

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"media-sequencer/internal/domain"
)

var DB *gorm.DB

func InitDB(dsn string) {
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Migrate the schema
	DB.AutoMigrate(&domain.Window{}, &domain.Media{}, &domain.PlaylistItem{})
}
