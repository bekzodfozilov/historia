import raw from "world-countries";
import type { Continent, Lang } from "./types";
import uzNames from "./countryNamesUz.json";

export interface Country {
  cca2: string; cca3: string; ccn3: string;
  nameEn: string; official: string;
  capital: string[]; region: string; subregion: string;
  continent: Continent | "antarctic";
  area: number; flag: string; latlng: [number, number];
  borders: string[]; languages: string[]; independent: boolean; unMember: boolean; landlocked: boolean;
}

const continentOf = (r: string): Country["continent"] =>
  r === "Africa" ? "africa" : r === "Asia" ? "asia" : r === "Europe" ? "europe" : r === "Americas" ? "americas" : r === "Oceania" ? "oceania" : "antarctic";

export const countries: Country[] = (raw as any[])
  .map((c) => ({
    cca2: c.cca2, cca3: c.cca3, ccn3: c.ccn3 ?? "",
    nameEn: c.name.common, official: c.name.official,
    capital: c.capital ?? [], region: c.region, subregion: c.subregion ?? "",
    continent: continentOf(c.region), area: c.area, flag: c.flag, latlng: c.latlng,
    borders: c.borders ?? [], languages: Object.values(c.languages ?? {}) as string[],
    independent: !!c.independent, unMember: !!c.unMember, landlocked: !!c.landlocked,
  }))
  .sort((a, b) => a.nameEn.localeCompare(b.nameEn));

export const byCca3 = new Map(countries.map((c) => [c.cca3, c]));
export const byCcn3 = new Map(countries.filter((c) => c.ccn3).map((c) => [String(Number(c.ccn3)), c]));

/** Country name in the UI language. Uzbek names are bundled (generated from Unicode CLDR). */
export function countryName(c: Country, lang: Lang): string {
  if (lang === "uz") return (uzNames as Record<string, string>)[c.cca2] ?? c.nameEn;
  return c.nameEn;
}

export const CONTINENTS = ["africa", "americas", "asia", "europe", "oceania"] as const;
