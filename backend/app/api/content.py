from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import select

from app.core.deps import DB, LangParam
from app.i18n import localize
from app.models import Civilization, Country, Event, Person
from app.search import search as run_search

router = APIRouter(tags=["content"])


def _404(kind: str):
    raise HTTPException(404, f"{kind} not found")


@router.get("/civilizations")
def list_civilizations(db: DB, lang: LangParam = None):
    rows = db.scalars(select(Civilization).order_by(Civilization.start_year))
    return [localize(r.data, lang) for r in rows]


@router.get("/civilizations/{slug}")
def get_civilization(slug: str, db: DB, lang: LangParam = None):
    r = db.scalar(select(Civilization).where(Civilization.slug == slug)) or _404("Civilization")
    return localize(r.data, lang)


@router.get("/people")
def list_people(db: DB, lang: LangParam = None, category: str | None = None):
    stmt = select(Person).order_by(Person.born_year)
    if category:
        stmt = stmt.where(Person.category == category)
    return [localize(r.data, lang) for r in db.scalars(stmt)]


@router.get("/people/{slug}")
def get_person(slug: str, db: DB, lang: LangParam = None):
    r = db.scalar(select(Person).where(Person.slug == slug)) or _404("Person")
    return localize(r.data, lang)


@router.get("/events")
def list_events(
    db: DB, lang: LangParam = None, category: str | None = None, continent: str | None = None,
    year_from: int | None = None, year_to: int | None = None,
):
    stmt = select(Event).order_by(Event.year)
    if category:
        stmt = stmt.where(Event.category == category)
    if continent:
        stmt = stmt.where(Event.continent == continent)
    if year_from is not None:
        stmt = stmt.where(Event.year >= year_from)
    if year_to is not None:
        stmt = stmt.where(Event.year <= year_to)
    return [localize(r.data, lang) for r in db.scalars(stmt)]


@router.get("/events/on-this-day")
def on_this_day(db: DB, month: Annotated[int, Query(ge=1, le=12)], day: Annotated[int, Query(ge=1, le=31)], lang: LangParam = None):
    rows = db.scalars(select(Event).where(Event.month == month, Event.day == day).order_by(Event.year))
    return [localize(r.data, lang) for r in rows]


@router.get("/events/{slug}")
def get_event(slug: str, db: DB, lang: LangParam = None):
    r = db.scalar(select(Event).where(Event.slug == slug)) or _404("Event")
    return localize(r.data, lang)


@router.get("/countries")
def list_countries(db: DB, lang: LangParam = None, continent: str | None = None):
    stmt = select(Country).order_by(Country.cca3)
    if continent:
        stmt = stmt.where(Country.continent == continent)
    return [localize(r.data, lang) for r in db.scalars(stmt)]


@router.get("/countries/{code}")
def get_country(code: str, db: DB, lang: LangParam = None):
    r = db.scalar(select(Country).where(Country.cca3 == code.upper())) or _404("Country")
    return localize(r.data, lang)


@router.get("/search")
def search(db: DB, q: Annotated[str, Query(max_length=100)], lang: LangParam = None, limit: Annotated[int, Query(ge=1, le=50)] = 10):
    return [localize(d, lang) for d in run_search(db, q, limit)]
