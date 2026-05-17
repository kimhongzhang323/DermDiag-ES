# DermDiag — Next.js Frontend

Production-grade port of the DermDiag prototype to Next.js 15 (App Router) + TypeScript + Tailwind CSS. Recreates the warm "paper" aesthetic (Newsreader serif + IBM Plex Sans/Mono, oklch greens, sticky topbar) and consumes the Go API.

## Quick start

```bash
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:8080
npm install
npm run dev                   # http://localhost:3000
```

## Pages

| Path             | Purpose                                                        |
|------------------|----------------------------------------------------------------|
| `/`              | Hero + 5-section questionnaire → results with rule trace       |
| `/login`         | Email/password sign-in                                          |
| `/register`      | Create account                                                  |
| `/cases`         | Saved cases (auth required)                                     |
| `/cases/[id]`    | Saved case detail with full rule trace                          |

JWT is stored in `localStorage` under `dermdiag.token` and sent as `Authorization: Bearer …`.

## Layout

```
frontend/src/
  app/
    layout.tsx, page.tsx, globals.css
    login/, register/, cases/, cases/[id]/
  components/
    TopBar.tsx, Hero.tsx, Stepper.tsx, Chip.tsx,
    Questionnaire.tsx, Results.tsx
  lib/
    api.ts        # typed fetch client, token helpers
    kb.ts         # symptom labels, sections, meta fields, CF banding
    types.ts      # API DTOs mirroring Go structs
```
