/**
 * Exports the typed frontend datasets to backend/app/seed/data.json so the API serves
 * exactly the same records. Run: npm run export:seed
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { civilizations } from "../src/data/civilizations";
import { civProfiles } from "../src/data/civProfiles";
import { people } from "../src/data/people";
import { allEvents } from "../src/data/events";
import { countries, countryName } from "../src/data/countries";
import { countryHistory } from "../src/data/countryHistory";
import { civEvents, personCiv, personContext, personCountry, relatedPeople } from "../src/data/links";

const data = {
  civilizations: civilizations.map((c) => ({ ...c, profile: civProfiles[c.slug] ?? null, events: civEvents[c.slug] ?? [] })),
  people: people.map((p) => ({
    ...p, country: personCountry[p.slug] ?? null, civilization: personCiv[p.slug] ?? null,
    related: relatedPeople[p.slug] ?? [], context: personContext[p.slug] ?? null,
  })),
  events: allEvents,
  countries: countries.map((c) => ({
    ...c, name: { en: c.nameEn, uz: countryName(c, "uz") }, history: countryHistory[c.cca3] ?? null,
  })),
};

const out = resolve(import.meta.dirname ?? __dirname, "../backend/app/seed/data.json");
writeFileSync(out, JSON.stringify(data, null, 1) + "\n");
console.log(`wrote ${out}: ${data.civilizations.length} civilizations, ${data.people.length} people, ${data.events.length} events, ${data.countries.length} countries`);
