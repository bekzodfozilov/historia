import type { HistDate, Lang, Localized } from "@/data/types";

export const tr = (l: Localized, lang: Lang) => l[lang] ?? l.en;

const era = (y: number, lang: Lang) =>
  y < 0 ? (lang === "uz" ? "mil. avv." : "BCE") : y < 600 ? (lang === "uz" ? "milodiy" : "CE") : "";

/** Render a historical date honouring its precision. */
export function formatDate(d: HistDate, lang: Lang): string {
  const y = Math.abs(d.year);
  const e = era(d.year, lang);
  const c = d.precision === "circa" ? (lang === "uz" ? "taxm. " : "c. ") : "";
  if (lang === "uz") {
    const base = d.year < 0 ? `${e} ${y}` : `${e ? e + " " : ""}${y}`;
    if (d.precision === "day" && d.month && d.day)
      return `${base}-yil ${d.day}-${UZ_MONTHS[d.month - 1]}`;
    return `${c}${base}`.trim();
  }
  if (d.precision === "day" && d.month && d.day)
    return `${d.day} ${EN_MONTHS[d.month - 1]} ${y}${e ? " " + e : ""}`;
  return `${c}${y}${e ? " " + e : ""}`;
}

export const formatRange = (a: HistDate, b: HistDate, lang: Lang) =>
  `${formatDate(a, lang)} – ${formatDate(b, lang)}`;

const EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const UZ_MONTHS = ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"];
export const monthName = (m: number, lang: Lang) => (lang === "uz" ? UZ_MONTHS : EN_MONTHS)[m - 1];
