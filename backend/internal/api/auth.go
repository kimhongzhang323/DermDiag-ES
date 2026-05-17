package api

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/krr/dermdiag/internal/auth"
)

type authReq struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName,omitempty"`
}

type authResp struct {
	Token string  `json:"token"`
	User  userOut `json:"user"`
}

type userOut struct {
	ID          uuid.UUID `json:"id"`
	Email       string    `json:"email"`
	DisplayName *string   `json:"displayName,omitempty"`
}

func (s *Server) Register(w http.ResponseWriter, r *http.Request) {
	var req authReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, 400, "invalid body")
		return
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if req.Email == "" || len(req.Password) < 8 {
		writeErr(w, 400, "email and password (min 8 chars) required")
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeErr(w, 500, "hash failed")
		return
	}
	var id uuid.UUID
	err = s.DB.QueryRow(r.Context(),
		`INSERT INTO users (email, password_hash, display_name) VALUES ($1,$2,$3)
		 RETURNING id`, req.Email, string(hash), nullableString(req.DisplayName)).Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
			writeErr(w, 409, "email already registered")
			return
		}
		writeErr(w, 500, "could not create user")
		return
	}
	tok, _ := auth.Issue(s.JWTSecret, id.String(), 7*24*time.Hour)
	writeJSON(w, 201, authResp{Token: tok, User: userOut{ID: id, Email: req.Email,
		DisplayName: nullableString(req.DisplayName)}})
}

func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
	var req authReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, 400, "invalid body")
		return
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	var (
		id          uuid.UUID
		hash        string
		displayName *string
	)
	err := s.DB.QueryRow(r.Context(),
		`SELECT id, password_hash, display_name FROM users WHERE email = $1`, req.Email).
		Scan(&id, &hash, &displayName)
	if err == pgx.ErrNoRows {
		writeErr(w, 401, "invalid credentials")
		return
	}
	if err != nil {
		writeErr(w, 500, "lookup failed")
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)) != nil {
		writeErr(w, 401, "invalid credentials")
		return
	}
	tok, _ := auth.Issue(s.JWTSecret, id.String(), 7*24*time.Hour)
	writeJSON(w, 200, authResp{Token: tok, User: userOut{ID: id, Email: req.Email, DisplayName: displayName}})
}

func (s *Server) Me(w http.ResponseWriter, r *http.Request) {
	uid, _ := auth.UserID(r.Context())
	var (
		email       string
		displayName *string
	)
	err := s.DB.QueryRow(r.Context(),
		`SELECT email, display_name FROM users WHERE id = $1`, uid).Scan(&email, &displayName)
	if err != nil {
		writeErr(w, 404, "user not found")
		return
	}
	writeJSON(w, 200, userOut{ID: uid, Email: email, DisplayName: displayName})
}

func nullableString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
