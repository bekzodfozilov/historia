import { describe, expect, it } from "vitest";
import { civilizations } from "@/data/civilizations";
import { civProfiles } from "@/data/civProfiles";
import { people } from "@/data/people";
import { allEvents, onThisDay, recentlyAdded, timelineEvents } from "@/data/events";
import { byCca3, countries } from "@/data/countries";
import { countryHistory } from "@/data/countryHistory";
import { civEvents, personCiv, personContext, personCountry, relatedPeople } from "@/data/links";
import en from "@/i18n/locales/en.json";
import uz from "@/i18n/locales/uz.json";
import { formatDate } from "@/lib/format";
import { search } from "@/lib/search";

const civSlugs = new Set(civilizations.map((c) => c.slug));
const personSlugs = new Set(people.map((p) => p.slug));
const eventSlugs = new Set(allEvents.map((e) => e.slug));

const flatKeys = (o: object, p = ""): string[] =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? flatKeys(v, `${p}${k}.`) : [`${p}${k}`]));

describe("data integrity", () => {
  it("slugs are unique", () => {
    expect(civSlugs.size).toBe(civilizations.length);
    expect(personSlugs.size).toBe(people.length);
    expect(eventSlugs.size).toBe(allEvents.length);
  });

  it("every record has EN and UZ text", () => {
    for (const c of civilizations) for (const f of [c.name, c.summary, c.region, c.capital]) expect(f.en && f.uz, c.slug).toBeTruthy();
    for (const p of people) for (const f of [p.name, p.role, p.summary]) expect(f.en && f.uz, p.slug).toBeTruthy();
    for (const e of allEvents) for (const f of [e.title, e.summary]) expect(f.en && f.uz, e.slug).toBeTruthy();
  });

  it("start dates precede end dates", () => {
    for (const c of civilizations) expect(c.start.year, c.slug).toBeLessThanOrEqual(c.end.year);
    for (const p of people) expect(p.born.year, p.slug).toBeLessThanOrEqual(p.died.year);
  });

  it("cross-links point to existing records", () => {
    for (const [civ, evs] of Object.entries(civEvents)) {
      expect(civSlugs.has(civ), civ).toBe(true);
      for (const e of evs) expect(eventSlugs.has(e), `${civ} -> ${e}`).toBe(true);
    }
    for (const [p, c] of Object.entries(personCiv)) { expect(personSlugs.has(p), p).toBe(true); expect(civSlugs.has(c), c).toBe(true); }
    for (const [p, c] of Object.entries(personCountry)) { expect(personSlugs.has(p), p).toBe(true); expect(byCca3.has(c), c).toBe(true); }
    for (const [p, rel] of Object.entries(relatedPeople)) { expect(personSlugs.has(p), p).toBe(true); for (const r of rel) expect(personSlugs.has(r), r).toBe(true); }
    for (const p of Object.keys(personContext)) expect(personSlugs.has(p), p).toBe(true);
    for (const [civ, prof] of Object.entries(civProfiles)) {
      expect(civSlugs.has(civ), civ).toBe(true);
      for (const code of prof.countries) expect(byCca3.has(code), `${civ} -> ${code}`).toBe(true);
    }
    for (const code of Object.keys(countryHistory)) expect(byCca3.has(code), code).toBe(true);
    const kinds = { civilizations: civSlugs, people: personSlugs, events: new Set(timelineEvents.map((e) => e.slug)) };
    for (const r of recentlyAdded) expect(kinds[r.kind].has(r.slug), r.slug).toBe(true);
  });

  it("on-this-day events match their calendar key", () => {
    for (const [k, evs] of Object.entries(onThisDay))
      for (const e of evs) expect(`${String(e.date.month).padStart(2, "0")}-${String(e.date.day).padStart(2, "0")}`, e.slug).toBe(k);
  });

  it("country dataset loads", () => {
    expect(countries.length).toBeGreaterThan(240);
    expect(byCca3.get("UZB")?.capital).toContain("Tashkent");
  });
});

describe("i18n", () => {
  it("EN and UZ locales have the same keys", () => {
    expect(flatKeys(uz).sort()).toEqual(flatKeys(en).sort());
  });
});

describe("formatDate", () => {
  it("handles BCE, circa and exact days", () => {
    expect(formatDate({ year: -3100, precision: "circa" }, "en")).toBe("c. 3100 BCE");
    expect(formatDate({ year: -3100, precision: "circa" }, "uz")).toBe("taxm. mil. avv. 3100");
    expect(formatDate({ year: 1453, month: 5, day: 29, precision: "day" }, "en")).toBe("29 May 1453");
    expect(formatDate({ year: 1453, month: 5, day: 29, precision: "day" }, "uz")).toBe("1453-yil 29-may");
    expect(formatDate({ year: 325, precision: "year" }, "en")).toBe("325 CE");
  });
});

describe("search", () => {
  it("finds records with typos in both languages", () => {
    expect(search("Ulugh Beg obsrvatory").some((d) => d.slug === "samarkand-observatory")).toBe(true);
    expect(search("Amir Temur").some((d) => d.slug === "amir-temur")).toBe(true);
    expect(search("   ")).toEqual([]);
  });
});
