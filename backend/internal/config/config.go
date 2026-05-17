package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	CORSOrigin  string
}

func Load() Config {
	_ = godotenv.Load()
	c := Config{
		Port:        env("PORT", "8080"),
		DatabaseURL: env("DATABASE_URL", ""),
		JWTSecret:   env("JWT_SECRET", ""),
		CORSOrigin:  env("CORS_ORIGIN", "http://localhost:3000"),
	}
	if c.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	if c.JWTSecret == "" {
		log.Fatal("JWT_SECRET is required")
	}
	return c
}

func env(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
