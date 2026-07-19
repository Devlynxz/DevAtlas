# Codecrew Blog

A full-stack blog platform with JWT authentication — a React + Tailwind CSS frontend backed by a FastAPI + PostgreSQL API.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232a)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.85-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)](https://www.python.org/)

---

## About

Codecrew Blog is a blogging platform built around a JWT-secured authentication flow — register, log in, and manage your session — served by an async FastAPI backend with a PostgreSQL database, and a Tailwind-styled React frontend.

## Tech Stack

| Layer      | Stack                                                             |
| ---------- | ------------------------------------------------------------------ |
| Frontend   | React 18, React Router, Tailwind CSS, Axios, React Toastify       |
| Backend    | FastAPI, SQLModel / SQLAlchemy (async), Alembic                   |
| Database   | PostgreSQL                                                         |
| Auth       | JWT (python-jose) with bcrypt password hashing                    |

## Project Structure

```
codecrew-blog/
├── frontend/   # React app (Create React App + Tailwind)
└── backend/    # FastAPI app (app/, migrations/, requirements.txt)
```

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.10
- PostgreSQL (running locally, or update `DATABASE_URL` to point elsewhere)

### Backend setup

```bash
cd backend
python -m venv venv
./venv/Scripts/activate        # Windows
pip install -r requirements.txt

cp .env.example .env           # then fill in your own DB credentials/secret key
uvicorn app.main:app --host localhost --port 8888 --reload
```

The API will be available at `http://localhost:8888`, with interactive docs at `http://localhost:8888/docs`.

### Frontend setup

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`.

## Environment Variables

The backend reads its configuration from `backend/.env` (see `backend/.env.example`):

| Variable                      | Description                          |
| ------------------------------ | ------------------------------------- |
| `DATABASE_URL`                 | PostgreSQL connection string          |
| `SECRET_KEY`                   | JWT signing secret                    |
| `ALGORITHM`                    | JWT signing algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES`  | Token lifetime in minutes             |

## Author

**Erlyn Quimson**

This project began as a collaborative exercise with the Codecrew Seekers team and has since been developed further here.
