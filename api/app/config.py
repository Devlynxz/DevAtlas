import os
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()


def _normalize_db_url(url: str):
    """Rewrite postgres://... / postgresql://... (as provided by most hosts'
    managed Postgres plugins) to the postgresql+asyncpg:// scheme asyncpg needs,
    and translate libpq-only query params (sslmode, channel_binding — used by
    e.g. Neon) that asyncpg's driver doesn't understand into connect_args."""
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://"):
        url = "postgresql+asyncpg://" + url[len("postgresql://"):]

    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query))
    connect_args = {}
    if query.pop("sslmode", None) == "require":
        connect_args["ssl"] = "require"
    query.pop("channel_binding", None)
    clean_url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))
    return clean_url, connect_args


DB_CONFIG, DB_CONNECT_ARGS = _normalize_db_url(os.environ.get(
    "DATABASE_URL", "postgresql+asyncpg://postgres:1234@localhost:5432/postgres"
))

SECRET_KEY = os.environ.get("SECRET_KEY", "codeseeker2023")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 10))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

class AsyncDatabaseSession:

    def __init__(self) -> None:
        self.session = None
        self.engine = None

    def __getattr__(self,name):
        return getattr(self.session,name)

    def init(self):
        self.engine = create_async_engine(DB_CONFIG, future=True, echo=True, connect_args=DB_CONNECT_ARGS)
        self.session = sessionmaker(self.engine, expire_on_commit=False, class_=AsyncSession)()


db = AsyncDatabaseSession()

async def commit_rollback():
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise