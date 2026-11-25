"""Editorial endpoints (admin/editor roles)."""
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from sqlalchemy import select

from app.core.deps import DB, require_role
from app.models import Event, User
from app.seed import event_row

router = APIRouter(prefix="/admin", tags=["admin"])
Editor = Annotated[User, Depends(require_role("admin", "editor"))]
Admin = Annotated[User, Depends(require_role("admin"))]


class Localized(BaseModel):
    en: str = Field(min_length=1)
    uz: str = Field(min_length=1)


class HistDate(BaseModel):
    year: int = Field(ge=-10000, le=2100)
    month: int | None = Field(default=None, ge=1, le=12)
    day: int | None = Field(default=None, ge=1, le=31)
    precision: Literal["day", "year", "circa", "century"]


class SourceIn(BaseModel):
    title: str
    publisher: str
    url: str | None = None


class EventIn(BaseModel):
    title: Localized
    summary: Localized
    date: HistDate
    category: Literal["politics", "wars", "science", "technology", "culture", "religion", "geography", "discoveries"]
    continent: Literal["africa", "asia", "europe", "americas", "oceania"]
    sources: list[SourceIn] = Field(min_length=1)


@router.put("/events/{slug}")
def upsert_event(slug: str, body: EventIn, db: DB, _: Editor, response: Response):
    data = {"slug": slug, **body.model_dump(exclude_none=True)}
    new = event_row(data)
    existing = db.scalar(select(Event).where(Event.slug == slug))
    if existing:
        for col in ("category", "continent", "year", "month", "day", "data"):
            setattr(existing, col, getattr(new, col))
    else:
        db.add(new)
        response.status_code = status.HTTP_201_CREATED
    db.commit()
    return data


@router.delete("/events/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(slug: str, db: DB, _: Admin):
    e = db.scalar(select(Event).where(Event.slug == slug))
    if e is None:
        raise HTTPException(404, "Event not found")
    db.delete(e)
    db.commit()


class RoleIn(BaseModel):
    role: Literal["admin", "editor", "reader"]


@router.put("/users/{user_id}/role")
def set_role(user_id: int, body: RoleIn, db: DB, _: Admin):
    u = db.get(User, user_id)
    if u is None:
        raise HTTPException(404, "User not found")
    u.role = body.role
    db.commit()
    return {"id": u.id, "email": u.email, "role": u.role}
