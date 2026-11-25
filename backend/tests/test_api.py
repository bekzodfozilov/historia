from app.core.config import Settings
from tests.conftest import login


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_seeded_counts(client):
    assert len(client.get("/api/v1/civilizations").json()) == 9
    assert len(client.get("/api/v1/people").json()) == 6
    assert len(client.get("/api/v1/events").json()) >= 30
    assert len(client.get("/api/v1/countries").json()) == 250


def test_lang_resolution(client):
    raw = client.get("/api/v1/civilizations/timurid-empire").json()
    assert set(raw["name"]) == {"en", "uz"}
    uz = client.get("/api/v1/civilizations/timurid-empire?lang=uz").json()
    assert uz["name"] == raw["name"]["uz"]
    assert isinstance(uz["profile"]["political"], str)
    assert client.get("/api/v1/civilizations/x?lang=fr").status_code == 422


def test_detail_and_404(client):
    assert client.get("/api/v1/countries/uzb?lang=en").json()["capital"] == ["Tashkent"]
    assert client.get("/api/v1/people/amir-temur").json()["country"] == "UZB"
    assert client.get("/api/v1/events/nope").status_code == 404


def test_filters(client):
    ev = client.get("/api/v1/events?category=science&year_from=1000").json()
    assert ev and all(e["category"] == "science" and e["date"]["year"] >= 1000 for e in ev)
    years = [e["date"]["year"] for e in client.get("/api/v1/events").json()]
    assert years == sorted(years)
    day = client.get("/api/v1/events/on-this-day?month=11&day=23").json()
    assert day and all(e["date"]["month"] == 11 and e["date"]["day"] == 23 for e in day)
    assert client.get("/api/v1/events/on-this-day?month=13&day=1").status_code == 422


def test_search_typo_tolerant(client):
    slugs = [d["slug"] for d in client.get("/api/v1/search?q=Ulugh Beg obsrvatory").json()]
    assert "samarkand-observatory" in slugs
    hit = client.get("/api/v1/search?q=temur&lang=uz").json()[0]
    assert isinstance(hit["title"], str)
    assert client.get("/api/v1/search?q=%20").json() == []


def test_auth_flow(client):
    r = client.post("/api/v1/auth/register", json={"email": "Reader@Example.com", "password": "password123"})
    assert r.status_code == 201 and r.json()["role"] == "reader"
    assert client.post("/api/v1/auth/register", json={"email": "reader@example.com", "password": "password123"}).status_code == 409
    assert client.post("/api/v1/auth/register", json={"email": "bad", "password": "password123"}).status_code == 422
    assert client.post("/api/v1/auth/login", json={"email": "reader@example.com", "password": "wrong-pass"}).status_code == 401

    tokens = client.post("/api/v1/auth/login", json={"email": "reader@example.com", "password": "password123"}).json()
    h = {"Authorization": f"Bearer {tokens['access_token']}"}
    assert client.get("/api/v1/auth/me", headers=h).json()["email"] == "reader@example.com"
    assert client.get("/api/v1/auth/me").status_code == 401
    # refresh token can't be used as access token, and vice versa
    assert client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tokens['refresh_token']}"}).status_code == 401
    assert client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["access_token"]}).status_code == 401
    assert client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}).status_code == 200


EVENT = {
    "title": {"en": "Test event", "uz": "Sinov voqeasi"},
    "summary": {"en": "Summary", "uz": "Qisqacha"},
    "date": {"year": 1500, "precision": "year"},
    "category": "culture", "continent": "asia",
    "sources": [{"title": "Test", "publisher": "Test"}],
}


def test_rbac(client, admin_headers):
    client.post("/api/v1/auth/register", json={"email": "r2@example.com", "password": "password123"})
    reader = login(client, "r2@example.com", "password123")
    assert client.put("/api/v1/admin/events/test-event", json=EVENT).status_code == 401
    assert client.put("/api/v1/admin/events/test-event", json=EVENT, headers=reader).status_code == 403

    assert client.put("/api/v1/admin/events/test-event", json=EVENT, headers=admin_headers).status_code == 201
    assert client.get("/api/v1/events/test-event?lang=uz").json()["title"] == "Sinov voqeasi"
    upd = {**EVENT, "date": {"year": 1501, "precision": "year"}}
    assert client.put("/api/v1/admin/events/test-event", json=upd, headers=admin_headers).status_code == 200
    assert client.get("/api/v1/events/test-event").json()["date"]["year"] == 1501
    assert client.delete("/api/v1/admin/events/test-event", headers=admin_headers).status_code == 204
    assert client.get("/api/v1/events/test-event").status_code == 404


def test_cors(client):
    r = client.get("/api/health", headers={"Origin": "https://historia.example"})
    assert r.headers["access-control-allow-origin"] == "https://historia.example"
    r = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in r.headers


def test_postgres_url_normalised():
    s = Settings(database_url="postgres://u:p@h:5432/db", jwt_secret="x" * 40)
    assert s.sqlalchemy_url == "postgresql+psycopg://u:p@h:5432/db"


def test_production_requires_secret():
    import pytest
    with pytest.raises(ValueError):
        Settings(environment="production", jwt_secret="too-short")
