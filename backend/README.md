# HISTORIA backend

FastAPI · SQLAlchemy 2 · PostgreSQL (SQLite locally) · JWT (access + refresh) · roles (admin / editor / reader)

## Run locally
```bash
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn app.main:app --reload --port 8000     # http://localhost:8000/api/docs
.venv/bin/python -m pytest -q                          # tests
```
Then start the frontend with `VITE_API_URL=http://localhost:8000 npm run dev` — the search bar queries the API
(and falls back to the bundled index if the API is unreachable).

On first start the tables are created and seeded from `app/seed/data.json`, which is exported from the
frontend datasets with `npm run export:seed` (re-run it after editing `src/data/*`, then reset the DB).

| Env var | Default | |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./historia.db` | `postgres://…` URLs are accepted |
| `JWT_SECRET` | dev value | required (32+ chars) when `ENVIRONMENT=production` |
| `CORS_ORIGINS` / `CORS_ORIGIN_REGEX` | localhost dev ports | frontend origins allowed to call the API |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | – | creates/promotes an admin on startup |

## Endpoints (`/api/v1`)
- `GET /civilizations`, `/civilizations/{slug}`, `/people?category=`, `/people/{slug}`
- `GET /events?category=&continent=&year_from=&year_to=`, `/events/on-this-day?month=&day=`, `/events/{slug}`
- `GET /countries?continent=`, `/countries/{cca3}`, `GET /search?q=&limit=`
- every read endpoint takes `?lang=en|uz` to resolve bilingual fields
- `POST /auth/register`, `/auth/login`, `/auth/refresh`, `GET /auth/me`
- `PUT /admin/events/{slug}` (editor/admin), `DELETE /admin/events/{slug}`, `PUT /admin/users/{id}/role` (admin)
- `GET /api/health`, OpenAPI docs at `/api/docs`

---

# Target architecture (roadmap)

FastAPI · PostgreSQL · SQLAlchemy 2 · Alembic · JWT (access + refresh) · RBAC

```
backend/
  app/
    main.py              # FastAPI app, CORS, routers
    core/{config,security,deps}.py
    db/{session,base}.py
    models/              # SQLAlchemy models (below)
    schemas/             # Pydantic DTOs, one per entity, with ?lang= resolution
    api/v1/{countries,civilizations,people,events,search,auth,admin}.py
    services/            # business logic, translation fallback, search ranking
  alembic/
```

## Core schema

Every article table follows the same pattern: a language-neutral row plus a `*_translations` table.

| Table | Key columns |
|---|---|
| `entities` | `id`, `kind` (country/civilization/empire/person/event/war/location), `slug`, `status` (draft/review/published), `created_at`, `updated_at` |
| `entity_translations` | `entity_id`, `lang`, `title`, `summary`, `body_md`, unique(`entity_id`,`lang`) |
| `historical_dates` | `entity_id`, `role` (start/end/birth/death/occurred), `year` (neg = BCE), `month`, `day`, `precision` (day/year/circa/century), `disputed` bool, `note_key` |
| `periods` | `id`, `slug`, `start_year`, `end_year` + translations |
| `countries` | `entity_id`, `iso_a3`, `continent`, `capital`, `population`, `flag_svg` |
| `borders` | `id`, `entity_id`, `valid_from`, `valid_to`, `geom` (PostGIS MultiPolygon), `source_id`, `confidence` |
| `locations` | `entity_id`, `geom` (Point) |
| `sources` | `id`, `title`, `publisher`, `url`, `kind` (museum/university/journal/unesco/encyclopedia), `accessed_at` |
| `entity_sources` | `entity_id`, `source_id`, `claim_ref` (cites a specific statement) |
| `relations` | `from_id`, `to_id`, `type` (ruled, fought_in, succeeded, influenced, located_in, part_of), `start_year`, `end_year` |
| `images` | `id`, `entity_id`, `url`, `license`, `credit`, `alt` + translations |
| `users`, `roles`, `user_roles` | roles: `admin`, `editor`, `translator`, `reviewer`, `reader` |
| `submissions` | editorial review queue with diff + reviewer + decision |

Search: `pg_trgm` GIN indexes on `entity_translations.title` for typo-tolerant suggestions, plus `tsvector` per language for full text.

The frontend `src/data/*.ts` files mirror these shapes so swapping static data for React Query calls to `/api/v1/...` is a per-hook change.
