import Fuse from "fuse.js";
import { civilizations } from "@/data/civilizations";
import { people } from "@/data/people";
import { allEvents } from "@/data/events";
import { countries, countryName } from "@/data/countries";

export type SearchKind = "countries" | "civilizations" | "people" | "events";
export interface SearchDoc { kind: SearchKind; slug: string; en: string; uz: string; meta_en: string; meta_uz: string }

const docs: SearchDoc[] = [
  ...civilizations.map((c) => ({ kind: "civilizations" as const, slug: c.slug, en: c.name.en, uz: c.name.uz, meta_en: c.region.en, meta_uz: c.region.uz })),
  ...people.map((p) => ({ kind: "people" as const, slug: p.slug, en: p.name.en, uz: p.name.uz, meta_en: p.role.en, meta_uz: p.role.uz })),
  ...countries.map((c) => ({ kind: "countries" as const, slug: c.cca3.toLowerCase(), en: c.nameEn, uz: countryName(c, "uz"), meta_en: c.subregion || c.region, meta_uz: c.capital.join(", ") })),
  ...allEvents.map((e) => ({ kind: "events" as const, slug: e.slug, en: e.title.en, uz: e.title.uz, meta_en: e.summary.en, meta_uz: e.summary.uz })),
];

/** Client-side fuzzy index (typo-tolerant). Replaced by /api/search (pg_trgm) in stage 8. */
const fuse = new Fuse(docs, {
  keys: [{ name: "en", weight: 2 }, { name: "uz", weight: 2 }, "meta_en", "meta_uz"],
  threshold: 0.38,
  ignoreLocation: true,
});

export const search = (q: string) => (q.trim() ? fuse.search(q, { limit: 9 }).map((r) => r.item) : []);
