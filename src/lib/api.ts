import type { SearchDoc, SearchKind } from "@/lib/search";

/** Backend base URL, e.g. https://historia-api.onrender.com. Empty = static mode (no backend). */
const raw = String(import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");
export const API_URL = raw && !/^https?:\/\//.test(raw) ? `https://${raw}` : raw;

type Bi = { en: string; uz: string };
interface ApiHit { kind: SearchKind; slug: string; title: Bi; meta: Bi }

export async function apiSearch(q: string, signal?: AbortSignal): Promise<SearchDoc[]> {
  const res = await fetch(`${API_URL}/api/v1/search?q=${encodeURIComponent(q)}&limit=9`, { signal });
  if (!res.ok) throw new Error(`search failed: ${res.status}`);
  const hits = (await res.json()) as ApiHit[];
  return hits.map((h) => ({ kind: h.kind, slug: h.slug, en: h.title.en, uz: h.title.uz, meta_en: h.meta.en, meta_uz: h.meta.uz }));
}
