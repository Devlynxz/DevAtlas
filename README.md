# DevAtlas

**Explore. Build. Share Knowledge.**

A modern, premium developer blog platform — a React + Tailwind CSS frontend backed by a FastAPI + PostgreSQL API, with full authentication, article publishing, categories, search, and author profiles.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232a)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.85-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)](https://www.python.org/)

---

## About

DevAtlas is a destination for developers to learn, share knowledge, and explore technology. It's built around a JWT-secured authentication flow, a Markdown-based article publishing engine with categories and search, and public author profiles — served by an async FastAPI backend with a PostgreSQL database, and a Tailwind-styled React frontend with light/dark themes.

## Tech Stack

| Layer      | Stack                                                             |
| ---------- | ------------------------------------------------------------------ |
| Frontend   | React 18, React Router, Tailwind CSS, Framer Motion, React Markdown, Axios, React Toastify |
| Backend    | FastAPI, SQLModel / SQLAlchemy (async), Alembic                   |
| Database   | PostgreSQL                                                         |
| Auth       | JWT (python-jose) with bcrypt password hashing                    |

## Project Structure

```
DevAtlas/
├── web/   # React app (Create React App + Tailwind)
└── api/   # FastAPI app (app/, migrations/, requirements.txt)
```

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.10
- PostgreSQL (running locally, or update `DATABASE_URL` to point elsewhere)

### Backend setup

```bash
cd api
python -m venv venv
./venv/Scripts/activate        # Windows
pip install -r requirements.txt

cp .env.example .env           # then fill in your own DB credentials/secret key
alembic upgrade head            # apply database migrations
uvicorn app.main:app --host localhost --port 8888 --reload
```

The API will be available at `http://localhost:8888`, with interactive docs at `http://localhost:8888/docs`.

Optionally, populate the database with realistic demo categories, authors, and articles:

```bash
python seed_data.py
```

Safe to re-run — anything that already exists is skipped. Demo authors are created with the password `DevAtlas2026!`.

### Frontend setup

```bash
cd web
npm install
npm start
```

The app will be available at `http://localhost:3000`.

## Environment Variables

The backend reads its configuration from `api/.env` (see `api/.env.example`):

| Variable                      | Description                          |
| ------------------------------ | ------------------------------------- |
| `DATABASE_URL`                 | PostgreSQL connection string          |
| `SECRET_KEY`                   | JWT signing secret                    |
| `ALGORITHM`                    | JWT signing algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES`  | Token lifetime in minutes             |

## Deployment

DevAtlas deploys as two separate services — a static React frontend and an async
FastAPI backend — because the backend holds a long-lived database session that
doesn't fit a serverless model.

### Frontend → Vercel

The repo root's `vercel.json` builds `web/` and serves `web/build`, with an SPA
rewrite so client-side routes don't 404. Set one environment variable on the
Vercel project:

| Variable              | Value                                    |
| ---------------------- | ----------------------------------------- |
| `REACT_APP_API_URL`    | Your deployed backend's public URL        |

### Backend → Render (free web service) + Neon (free Postgres)

Render's own free Postgres auto-deletes after 30 days, so the database lives on
Neon instead — its free tier is permanent (scales to zero when idle, but never
expires or gets deleted).

1. **Neon**: create a project, copy its connection string (looks like
   `postgresql://user:pass@host/db?sslmode=require&channel_binding=require`).
   The app strips the `sslmode`/`channel_binding` params (asyncpg doesn't
   understand them) and translates them into the SSL connect args asyncpg
   actually needs, so you can paste Neon's string as-is.
2. **Render**: create a Blueprint from this GitHub repo — it reads the root
   `render.yaml`, which builds/starts the API from `api/` on the free plan and
   runs `alembic upgrade head && python seed_data.py` (idempotent) before every
   deploy. When prompted, set:
   - `DATABASE_URL` → the Neon connection string from step 1
   - `SECRET_KEY` → any random secret
   - `CORS_ORIGINS` → your Vercel URL, e.g. `https://your-app.vercel.app`
3. Deploy, then copy the Render service's public URL into the frontend's
   `REACT_APP_API_URL` on Vercel and redeploy the frontend.

Note: the free Render service spins down after 15 minutes idle, so the first
request after a period of inactivity takes a few extra seconds to wake up.

`api/railway.json` is also included if you'd rather deploy on
[Railway](https://railway.com) instead (paid usage-based, but simpler — one
service instead of two) — same env vars, `DATABASE_URL` comes from Railway's
own Postgres plugin in that case.

Uploaded media (avatars, cover images) is written to local disk (`api/media/`),
which is ephemeral on most PaaS hosts — attach a persistent volume mounted at
`api/media` if uploads need to survive redeploys.

## Author

**Erlyn Quimson**

This project began as a collaborative exercise with the Codecrew Seekers team and has since been developed further into DevAtlas.
