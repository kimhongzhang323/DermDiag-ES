package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/krr/dermdiag/internal/auth"
	"github.com/krr/dermdiag/internal/engine"
)

type caseRow struct {
	ID        uuid.UUID `json:"id"`
	Title     *string   `json:"title"`
	Verdict   string    `json:"verdict"`
	TopDx     *string   `json:"topDx"`
	TopCF     *float64  `json:"topCf"`
	CreatedAt time.Time `json:"createdAt"`
}

type caseDetail struct {
	caseRow
	Facts  engine.Facts  `json:"facts"`
	Result engine.Result `json:"result"`
}

type createCaseReq struct {
	Title string       `json:"title"`
	Facts engine.Facts `json:"facts"`
}

func (s *Server) ListCases(w http.ResponseWriter, r *http.Request) {
	uid, _ := auth.UserID(r.Context())
	rows, err := s.DB.Query(r.Context(),
		`SELECT id, title, verdict, top_dx, top_cf, created_at
		 FROM cases WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200`, uid)
	if err != nil {
		writeErr(w, 500, "query failed")
		return
	}
	defer rows.Close()
	out := []caseRow{}
	for rows.Next() {
		var c caseRow
		if err := rows.Scan(&c.ID, &c.Title, &c.Verdict, &c.TopDx, &c.TopCF, &c.CreatedAt); err != nil {
			writeErr(w, 500, "scan failed")
			return
		}
		out = append(out, c)
	}
	writeJSON(w, 200, out)
}

func (s *Server) CreateCase(w http.ResponseWriter, r *http.Request) {
	uid, _ := auth.UserID(r.Context())
	var req createCaseReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, 400, "invalid body")
		return
	}
	result := engine.Run(req.Facts)

	factsJSON, _ := json.Marshal(req.Facts)
	resultJSON, _ := json.Marshal(result)

	var topDx *string
	var topCF *float64
	if len(result.Diagnoses) > 0 {
		topDx = &result.Diagnoses[0].Dx
		topCF = &result.Diagnoses[0].CF
	}
	title := nullableString(req.Title)

	var id uuid.UUID
	var createdAt time.Time
	err := s.DB.QueryRow(r.Context(),
		`INSERT INTO cases (user_id, title, facts, result, verdict, top_dx, top_cf)
		 VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, created_at`,
		uid, title, factsJSON, resultJSON, result.Verdict, topDx, topCF).Scan(&id, &createdAt)
	if err != nil {
		writeErr(w, 500, "insert failed")
		return
	}
	writeJSON(w, 201, caseDetail{
		caseRow: caseRow{ID: id, Title: title, Verdict: result.Verdict,
			TopDx: topDx, TopCF: topCF, CreatedAt: createdAt},
		Facts: req.Facts, Result: result,
	})
}

func (s *Server) GetCase(w http.ResponseWriter, r *http.Request) {
	uid, _ := auth.UserID(r.Context())
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeErr(w, 400, "bad id")
		return
	}
	var (
		c          caseRow
		factsRaw   []byte
		resultRaw  []byte
	)
	err = s.DB.QueryRow(r.Context(),
		`SELECT id, title, verdict, top_dx, top_cf, created_at, facts, result
		 FROM cases WHERE id = $1 AND user_id = $2`, id, uid).
		Scan(&c.ID, &c.Title, &c.Verdict, &c.TopDx, &c.TopCF, &c.CreatedAt, &factsRaw, &resultRaw)
	if err == pgx.ErrNoRows {
		writeErr(w, 404, "not found")
		return
	}
	if err != nil {
		writeErr(w, 500, "query failed")
		return
	}
	var facts engine.Facts
	var result engine.Result
	_ = json.Unmarshal(factsRaw, &facts)
	_ = json.Unmarshal(resultRaw, &result)
	writeJSON(w, 200, caseDetail{caseRow: c, Facts: facts, Result: result})
}

func (s *Server) DeleteCase(w http.ResponseWriter, r *http.Request) {
	uid, _ := auth.UserID(r.Context())
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeErr(w, 400, "bad id")
		return
	}
	ct, err := s.DB.Exec(r.Context(),
		`DELETE FROM cases WHERE id = $1 AND user_id = $2`, id, uid)
	if err != nil {
		writeErr(w, 500, "delete failed")
		return
	}
	if ct.RowsAffected() == 0 {
		writeErr(w, 404, "not found")
		return
	}
	w.WriteHeader(204)
}
