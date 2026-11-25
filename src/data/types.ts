/**
 * Domain types mirror the planned PostgreSQL schema (see backend/README.md).
 * Every article is translatable, sourced, and carries date precision.
 */
export type Lang = "en" | "uz";
export type Localized = Record<Lang, string>;

/** Negative years = BCE. `precision` tells the UI how to render the date. */
export interface HistDate {
  year: number;
  month?: number;
  day?: number;
  precision: "day" | "year" | "circa" | "century";
}

export interface Source { title: string; publisher: string; url?: string }

export type Continent = "africa" | "asia" | "europe" | "americas" | "oceania";
export type EventCategory =
  | "politics" | "wars" | "science" | "technology"
  | "culture" | "religion" | "geography" | "discoveries";

export interface Civilization {
  slug: string;
  name: Localized;
  start: HistDate;
  end: HistDate;
  region: Localized;
  summary: Localized;
  capital: Localized;
  /** Peak area in million km², only where scholarly estimates exist */
  peakAreaMkm2?: number;
  disputed?: Localized;
  sources: Source[];
  glyph: string; // decorative monogram until licensed imagery is attached
}

export interface Person {
  slug: string;
  name: Localized;
  born: HistDate;
  died: HistDate;
  role: Localized;
  category: "rulers" | "military" | "scientists" | "philosophers" | "explorers" | "political" | "artists" | "religious";
  summary: Localized;
  sources: Source[];
}

export interface HistEvent {
  slug: string;
  title: Localized;
  date: HistDate;
  category: EventCategory;
  continent: Continent;
  summary: Localized;
  sources: Source[];
}
