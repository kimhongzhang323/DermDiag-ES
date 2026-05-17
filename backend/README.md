# DermDiag — Go Backend

REST API for the DermDiag expert system. Ports `kb.js` + `engine.js` to Go,
adds user accounts (JWT + bcrypt) and case-history persistence on Postgres.

## Stack

- **Go 1.22** with `chi` router
- **PostgreSQL** via `pgx/v5` (no ORM; plain SQL)
- **JWT** auth (HS256, 7-day tokens), bcrypt password hashing
- Stateless, CORS-ready

## Quick start

```bash
cp .env.example .env          # fill DATABASE_URL & JWT_SECRET
psql "$DATABASE_URL" -f migrations/001_init.sql
go mod tidy
go run ./cmd/server
```

Server listens on `:8080` by default.

## Endpoints

| Method | Path                | Auth | Purpose                              |
|--------|---------------------|------|--------------------------------------|
| GET    | `/healthz`          | —    | Liveness check                       |
| GET    | `/api/kb`           | —    | Full knowledge base (conditions, symptom labels, rules, red flags) |
| POST   | `/api/diagnose`     | —    | Run inference. Body: `{symptoms, meta}` |
| POST   | `/api/auth/register`| —    | Create account → returns JWT         |
| POST   | `/api/auth/login`   | —    | Exchange credentials for JWT         |
| GET    | `/api/me`           | ✓    | Current user                          |
| GET    | `/api/cases`        | ✓    | List saved cases (newest first)       |
| POST   | `/api/cases`        | ✓    | Save a case (runs inference server-side) |
| GET    | `/api/cases/{id}`   | ✓    | Full case with facts + result trace   |
| DELETE | `/api/cases/{id}`   | ✓    | Delete a case                         |

## Project layout

```
backend/
  cmd/server/main.go         entrypoint
  internal/
    kb/        knowledge base (conditions, symptoms, rules, red flags)
    engine/    forward-chaining + MYCIN CF combination
    api/       HTTP handlers (chi)
    auth/      JWT issue/verify + middleware
    db/        pgx pool
    config/    env loading
  migrations/001_init.sql
```
