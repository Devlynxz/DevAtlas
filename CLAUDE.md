# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

DevAtlas is a developer blog platform: a React 18 + Tailwind CSS frontend (`web/`) backed by an async FastAPI + PostgreSQL API (`api/`), with JWT authentication, Markdown article publishing, categories, search, and public author profiles.

## Commands

### Backend (`api/`)

```bash
cd api
python -m venv venv
./venv/Scripts/activate            # Windows
pip install -r requirements.txt    # or: poetry install

cp .env.example .env               # fill in DATABASE_URL / SECRET_KEY
alembic upgrade head               # apply migrations
uvicorn app.main:app --host localhost --port 8888 --reload
```

- API: `http://localhost:8888`, interactive docs at `http://localhost:8888/docs`.
- Create a new migration after changing a model: `alembic revision --autogenerate -m "description"`, then `alembic upgrade head`.
- Seed demo data (safe to re-run, skips existing): `python seed_data.py` (demo authors get password `DevAtlas2026!`).
- There is no test suite or lint config in `api/`.

### Frontend (`web/`)

```bash
cd web
npm install
npm start          # dev server on http://localhost:3000
npm run build
npm test           # react-scripts / Jest, interactive watch mode
```

- `web/src` is exercised via Create React App (`react-scripts`); ESLint config is the CRA default (`react-app`, `react-app/jest`), no separate lint script.
- No test files currently exist under `web/src`, despite the testing-library deps being installed.

## Environment variables (`api/.env`, see `api/.env.example`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (async driver: `postgresql+asyncpg://...`) |
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT signing algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes |

Frontend reads `REACT_APP_API_URL` (defaults to `http://localhost:8888`) — see `web/src/api/client.js`.

CORS on the backend (`api/app/main.py`) is hardcoded to allow only `http://localhost:3000`; update the `origins` list there if the frontend origin changes.

## Backend architecture (`api/app`)

Layered, per-resource: **controller → service → repository → model**, each split into its own file per domain (e.g. `posts`, `users`, `categories`, `authors`, `newsletter`, `contact`).

- `controller/*.py` — FastAPI routers only (one `APIRouter` per file, included in `app/main.py:init_app`). No business logic; delegates straight to a `*Service`.
- `service/*.py` — business logic, validation, orchestration across repositories.
- `repository/*.py` — DB access. Most repositories subclass `repository/base_repo.py:BaseRepo`, a generic `create`/`get_all`/`get_by_id`/`update`/`delete` built on the shared async session in `app/config.py:db`. Auth-specific token logic lives in `repository/auth_repo.py` (`JWTRepo` for encode/decode, `JWTBearer` as the FastAPI security scheme).
- `model/*.py` — SQLModel table models (`table=True`). Most inherit `model/mixins.py:TimeMixin` for `created_at`/`modified_at`. Primary keys are app-generated UUID strings (`str(uuid4())`), not DB-generated — always set `id` explicitly when constructing a new row (see `service/auth_service.py`).
- `schema/*.py` — Pydantic request/response schemas, separate from the SQLModel table models. Nearly all endpoints return `schema/common.py:ResponseSchema` (`{"detail": ..., "result": ...}`).
- `app/dependencies.py` — `get_current_user` (decodes the bearer JWT, loads the `Users` row with roles) and `require_roles(...)`/`require_admin` for role-gated endpoints.
- `app/config.py` — loads `.env`, exposes the shared `db` (`AsyncDatabaseSession`, a thin wrapper around one long-lived async SQLAlchemy session) and `commit_rollback()` used at the end of every write in `BaseRepo`.
- Users have a many-to-many relation to `Role` via the `UsersRole` link model; roles (`admin`, `user`) are seeded automatically on startup by `service/auth_service.py:generate_role`, not via migration data.
- `Users` and `Person` are separate tables (1:1) — `Person` holds profile/bio fields, `Users` holds credentials and auth.
- Migrations: Alembic, config in `api/alembic.ini`, env in `api/migrations/env.py`, versions in `api/migrations/versions/`.
- Uploaded media (avatars, post cover images) is written to `api/media/` and served at `/media` via `StaticFiles`.

## Frontend architecture (`web/src`)

- `App.js` defines all routes with `react-router-dom`; everything is nested under a single `Layout` route except `NotFoundPage`. Protected routes (`/profile`, `/my-posts`, `/new-post`, `/edit-post/:postId`) are wrapped in `components/auth/ProtectedRoute`.
- `context/AuthContext.js` — the auth source of truth. Stores `auth_token`/`auth_token_type` in `localStorage`, loads the profile on mount via `fetchMyProfile`, exposes `login`/`register`/`logout`/`refreshProfile` through `useAuth()`.
- `context/ThemeContext.js` — light/dark theme, paired with Tailwind's `darkMode: "class"` config.
- `api/client.js` — single Axios instance (`API_BASE_URL` from `REACT_APP_API_URL`); a request interceptor attaches the bearer token from `localStorage` on every call. All other files under `api/` (`auth.js`, `posts.js`, `categories.js`, `authors.js`, `contact.js`, `newsletter.js`) are thin wrappers around this client, one per backend resource — mirrors the backend's controller split.
- `mediaUrl()` in `api/client.js` resolves relative `/media/...` paths returned by the API into absolute URLs for `<img>` tags.
- `pages/` are route-level screens; `components/` is split by domain (`auth/`, `blog/`, `layout/`, `motion/`, `ui/`).
- `hooks/usePosts.js` centralizes list/pagination/filter state for post-listing pages.
- Styling is Tailwind with a custom design token set in `tailwind.config.js` (`primary`/`accent`/`surface`/`ink` color scales, `heading`/`body` font families, `fade-in`/`slide-up` keyframes) — prefer these tokens over ad hoc colors/animations when styling new UI.
