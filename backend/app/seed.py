"""Loads app/seed/data.json (exported from the frontend datasets) into an empty database."""
import json
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import hash_password
from app.models import Civilization, Country, Event, Person, User

SEED_FILE = Path(__file__).parent / "seed" / "data.json"


def event_row(e: dict) -> Event:
    d = e["date"]
    return Event(slug=e["slug"], category=e["category"], continent=e["continent"],
                 year=d["year"], month=d.get("month"), day=d.get("day"), data=e)


def seed_content(db: Session) -> bool:
    if db.scalar(select(func.count()).select_from(Civilization)):
        return False
    data = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    db.add_all(Civilization(slug=c["slug"], start_year=c["start"]["year"], end_year=c["end"]["year"], data=c)
               for c in data["civilizations"])
    db.add_all(Person(slug=p["slug"], category=p["category"], born_year=p["born"]["year"], data=p) for p in data["people"])
    db.add_all(event_row(e) for e in data["events"])
    db.add_all(Country(cca3=c["cca3"], continent=c["continent"], data=c) for c in data["countries"])
    db.commit()
    return True


def ensure_admin(db: Session) -> None:
    s = get_settings()
    if not (s.admin_email and s.admin_password):
        return
    email = s.admin_email.strip().lower()
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        db.add(User(email=email, password_hash=hash_password(s.admin_password), role="admin"))
    elif user.role != "admin":
        user.role = "admin"
    db.commit()
