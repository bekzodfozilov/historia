"""
Tables. Language-neutral columns used for filtering/sorting are real columns; the bilingual
article body (names, summaries, sources, profiles) lives in a JSON `data` column so the
API can return it as-is or resolved to one language with ?lang=.
"""
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Civilization(Base):
    __tablename__ = "civilizations"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    start_year: Mapped[int] = mapped_column(Integer, index=True)
    end_year: Mapped[int] = mapped_column(Integer)
    data: Mapped[dict] = mapped_column(JSON)


class Person(Base):
    __tablename__ = "people"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(40), index=True)
    born_year: Mapped[int] = mapped_column(Integer, index=True)
    data: Mapped[dict] = mapped_column(JSON)


class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(40), index=True)
    continent: Mapped[str] = mapped_column(String(20), index=True)
    year: Mapped[int] = mapped_column(Integer, index=True)
    month: Mapped[int | None] = mapped_column(Integer, nullable=True)
    day: Mapped[int | None] = mapped_column(Integer, nullable=True)
    data: Mapped[dict] = mapped_column(JSON)


class Country(Base):
    __tablename__ = "countries"
    id: Mapped[int] = mapped_column(primary_key=True)
    cca3: Mapped[str] = mapped_column(String(3), unique=True, index=True)
    continent: Mapped[str] = mapped_column(String(20), index=True)
    data: Mapped[dict] = mapped_column(JSON)


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(20), default="reader")  # admin | editor | reader
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
