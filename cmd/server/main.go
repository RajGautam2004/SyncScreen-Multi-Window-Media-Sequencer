package main

import (
	"log"

	"media-sequencer/configs"
	"media-sequencer/internal/handler"
	"media-sequencer/internal/repository"
	"media-sequencer/internal/scheduler"
	"media-sequencer/internal/websocket"
	"media-sequencer/migrations"
)

func main() {
	cfg := configs.LoadConfig()

	repository.InitDB(cfg.DatabaseDSN)

	// Seed only if db is empty (simplified check)
	windows, _ := repository.GetAllWindows()
	if len(windows) == 0 {
		migrations.SeedDatabase()
	}

	hub := websocket.NewHub()
	go hub.Run()

	scheduler.InitScheduler(hub)

	r := handler.SetupRouter(hub)

	port := cfg.ServerPort
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
