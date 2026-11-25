"""Typo-tolerant search over all entities. The dataset is small, so it ranks in Python;
on Postgres this can move to pg_trgm similarity() with a GIN index."""
import unicodedata
from difflib import SequenceMatcher

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Civilization, Country, Event, Person


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    return " ".join(s.replace("‘", "'").replace("’", "'").replace("ʻ", "'").replace("-", " ").split())


def _score(q: str, text: str) -> float:
    t = norm(text)
    if not t:
        return 0.0
    if t == q:
        return 1.0
    if t.startswith(q):
        return 0.95
    if q in t:
        return 0.9
    words, n = t.split(), len(q.split())
    windows = [" ".join(words[i:i + n]) for i in range(max(1, len(words) - n + 1))]
    return max(SequenceMatcher(None, q, w).ratio() for w in windows) * 0.85


def search(db: Session, q: str, limit: int = 10) -> list[dict]:
    q = norm(q)
    if not q:
        return []
    docs: list[tuple[str, str, dict, dict]] = []
    for c in db.scalars(select(Civilization)):
        docs.append(("civilizations", c.slug, c.data["name"], c.data["region"]))
    for p in db.scalars(select(Person)):
        docs.append(("people", p.slug, p.data["name"], p.data["role"]))
    for e in db.scalars(select(Event)):
        docs.append(("events", e.slug, e.data["title"], e.data["summary"]))
    for k in db.scalars(select(Country)):
        cap = ", ".join(k.data.get("capital") or [])
        docs.append(("countries", k.cca3.lower(), k.data["name"], {"en": k.data.get("subregion") or k.data.get("region", ""), "uz": cap}))

    ranked = []
    for kind, slug, title, meta in docs:
        s = max(_score(q, title["en"]), _score(q, title["uz"]))
        s = max(s, 0.7 * max(_score(q, meta["en"]), _score(q, meta["uz"])))
        if s >= 0.6:
            ranked.append((s, {"kind": kind, "slug": slug, "title": title, "meta": meta, "score": round(s, 3)}))
    ranked.sort(key=lambda r: -r[0])
    return [d for _, d in ranked[:limit]]
