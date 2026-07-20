import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import db
from app.service.auth_service import generate_role

origins= [
    "http://localhost:3000"
]

def init_app():
    db.init()

    app = FastAPI(
        title= "DevAtlas API",
        description= "The API powering DevAtlas — a developer blog platform",
        version= "1"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.on_event("startup")
    async def starup():
        await generate_role()

    @app.on_event("shutdown")
    async def shutdown():
        await db.close()

    os.makedirs("media/avatars", exist_ok=True)
    app.mount("/media", StaticFiles(directory="media"), name="media")

    from app.controller import authentication, users, posts, categories, authors, newsletter, contact

    app.include_router(authentication.router)
    app.include_router(users.router)
    app.include_router(posts.router)
    app.include_router(categories.router)
    app.include_router(authors.router)
    app.include_router(newsletter.router)
    app.include_router(contact.router)

    return app

app = init_app()

def start():
    """Launched with 'poetry run start' at root level """
    uvicorn.run("app.main:app", host="localhost", port=8888, reload=True)