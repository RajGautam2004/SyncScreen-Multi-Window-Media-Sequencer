package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseDSN string
	ServerPort  string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	// Support Neon's DATABASE_URL or local DATABASE_DSN
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = os.Getenv("DATABASE_DSN")
	}

	// Support Render's PORT or local SERVER_PORT
	port := os.Getenv("PORT")
	if port == "" {
		port = os.Getenv("SERVER_PORT")
	}

	return &Config{
		DatabaseDSN: dsn,
		ServerPort:  port,
	}
}
