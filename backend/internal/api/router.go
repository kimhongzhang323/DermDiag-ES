package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/krr/dermdiag/internal/auth"
	"github.com/krr/dermdiag/internal/kb"
)

type Server struct {
	DB        *pgxpool.Pool
	JWTSecret string
}

func New(db *pgxpool.Pool, jwtSecret, corsOrigin string) http.Handler {
	s := &Server{DB: db, JWTSecret: jwtSecret}
	r := chi.NewRouter()
	r.Use(middleware.RequestID, middleware.Logger, middleware.Recoverer)
	r.Use(middleware.Timeout(15 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{corsOrigin},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) { w.Write([]byte("ok")) })

	r.Get("/api/kb", s.GetKB)
	r.Post("/api/diagnose", s.Diagnose)

	r.Post("/api/auth/register", s.Register)
	r.Post("/api/auth/login", s.Login)

	r.Group(func(r chi.Router) {
		r.Use(auth.Middleware(jwtSecret))
		r.Get("/api/me", s.Me)
		r.Get("/api/cases", s.ListCases)
		r.Post("/api/cases", s.CreateCase)
		r.Get("/api/cases/{id}", s.GetCase)
		r.Delete("/api/cases/{id}", s.DeleteCase)
	})

	return r
}

func (s *Server) GetKB(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, 200, map[string]any{
		"conditions":    kb.Conditions,
		"symptomLabels": kb.SymptomLabels,
		"rules":         kb.Rules,
		"redFlags":      kb.RedFlags,
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
