package api

import (
	"encoding/json"
	"net/http"

	"github.com/krr/dermdiag/internal/engine"
)

func (s *Server) Diagnose(w http.ResponseWriter, r *http.Request) {
	var f engine.Facts
	if err := json.NewDecoder(r.Body).Decode(&f); err != nil {
		writeErr(w, 400, "invalid body")
		return
	}
	writeJSON(w, 200, engine.Run(f))
}
