from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api import admin, auth, content
from app.core.config import get_settings
from app.core.deps import DB
from app.db import Base, SessionLocal, engine
from app.seed import ensure_admin, seed_content


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed_content(db)
        ensure_admin(db)
    yield


settings = get_settings()
app = FastAPI(title="HISTORIA API", version="1.0.0", lifespan=lifespan,
              docs_url="/api/docs", openapi_url="/api/openapi.json", redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_origin_regex=settings.cors_origin_regex,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

for r in (content.router, auth.router, admin.router):
    app.include_router(r, prefix="/api/v1")


@app.get("/api/health", tags=["meta"])
def health(db: DB):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def root():
    return {"name": "HISTORIA API", "docs": "/api/docs", "health": "/api/health"}
