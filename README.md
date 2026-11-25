# HISTORIA — Stages 1–6 (frontend)

Architecture, design system, navigation, bilingual (EN/UZ) system and homepage.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build
```

## Structure
```
src/
  app/App.tsx            router (lazy routes), React Query, layout
  i18n/                  i18next setup + locales/en.json, uz.json (add a language = add a JSON + 1 line)
  styles/index.css       design tokens as Tailwind layers (colors in tailwind.config.js)
  components/layout/     Header (desktop + mobile nav), Footer, LanguageSwitcher
  components/home/       Hero, SearchBar, FeaturedTimeline, FeaturedCivilizations,
                         WorldMapSection, PopularPeople, OnThisDay, RecentlyAdded
  components/ui/         Section, Tag
  pages/                 HomePage, EntityPage (/civilizations|people|events/:slug), SectionPage
  data/                  typed sample records (mirror the DB schema in backend/README.md)
  lib/                   date formatting with precision/BCE, fuzzy search, useLang
  store/                 Zustand (persisted search history)
```

## What works
- EN/UZ switch in the header, persisted in `localStorage` (`historia.lang`); `<html lang>` follows.
- Global search: instant, grouped, typo-tolerant (Fuse.js), keyboard navigation, `/` shortcut, persisted history.
- Timeline: drag/scroll, category filter, piecewise time scale, date precision (`c.`, BCE, exact days).
- World map: real Natural Earth 110m geometry (public domain), hover to identify.
- On this day: follows today's date, prev/next day, designed empty state for uncatalogued days.
- Disputed dates flagged on cards and articles; every record carries sources.
- Every link resolves to a real route.

## Notes
- No photography ships: imagery must be licensed (museum/Wikimedia Commons with credit). Slots use
  monograms/engraving-style SVG until the `images` table is populated.
- shadcn/ui is set up in stage 2 once forms/dialogs/filters are needed; stage 1 needs none.
- Sample content is deliberately small and cited; it is not presented as comprehensive.

## Pages (all live)
| Route | Page |
|---|---|
| `/` | Home |
| `/explore` | Atlas: zoom/pan, click a country, compare two, civilization layer (`?c=uzb&vs=irn&layer=timurid-empire`) |
| `/countries`, `/countries/:cca3` | 250 countries; search, continent, period, sort (state in URL); profiles |
| `/timeline` | Zoomable global timeline by continent lanes, filters, "what happened in this year" (`?year=1453`) |
| `/civilizations`, `/civilizations/:slug` | Directory and full profiles |
| `/compare` | Compare two empires (`?a=&b=`) |
| `/people`, `/people/:slug` | Directory with category filter; profiles |
| `/events`, `/events/:slug` | Directory with category/continent filters; event pages |

## Tests
```bash
npm test             # data integrity (cross-links, EN/UZ parity), date formatting, search
```

## Deploying to Render
`render.yaml` is a Render Blueprint: a static site that runs `npm ci && npm test && npm run build`,
publishes `dist/`, and rewrites `/* → /index.html` so deep links work on refresh.
In Render: **New → Blueprint → pick this GitHub repo → Apply**. Every push to `main` redeploys.
