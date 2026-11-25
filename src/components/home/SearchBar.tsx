import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Clock, CornerDownLeft } from "lucide-react";
import { search, type SearchDoc } from "@/lib/search";
import { useSearchStore } from "@/store/search";
import { API_URL, apiSearch } from "@/lib/api";
import { useLang } from "@/lib/useLang";

export function SearchBar() {
  const { t, lang } = useLang();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const { history, push, clear } = useSearchStore();
  const [debounced, setDebounced] = useState("");
  useEffect(() => { const id = setTimeout(() => setDebounced(q.trim()), 200); return () => clearTimeout(id); }, [q]);
  const local = useMemo(() => search(q), [q]);
  // With a backend configured, rank on the server; fall back to the bundled index while loading or if the API is down.
  const remote = useQuery({
    queryKey: ["search", debounced],
    queryFn: ({ signal }) => apiSearch(debounced, signal),
    enabled: !!API_URL && !!debounced,
    staleTime: 60_000,
    retry: 0,
  });
  const results = (q.trim() === debounced && remote.data) || local;

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const editing = !!el && (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable);
      if (e.key === "/" && !editing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); input.current?.focus(); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  useEffect(() => setActive(0), [q]);

  const go = (d: SearchDoc) => { push(d[lang]); setOpen(false); nav(`/${d.kind}/${d.slug}`); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) go(results[active]);
    if (e.key === "Escape") { setOpen(false); input.current?.blur(); }
  };

  const groups = (["countries", "civilizations", "people", "events"] as const)
    .map((k) => ({ k, items: results.filter((r) => r.kind === k) }))
    .filter((g) => g.items.length);

  return (
    <div className="relative w-full max-w-2xl" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <label className="flex items-center gap-4 border border-ivory/20 bg-ink/70 px-5 py-4 backdrop-blur transition-colors focus-within:border-gold">
        <Search className="h-5 w-5 shrink-0 text-gold" aria-hidden />
        <input
          ref={input} value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setOpen(true)} onKeyDown={onKey}
          placeholder={t("search.placeholder")} aria-label={t("search.placeholder")}
          role="combobox" aria-expanded={open} aria-controls="search-panel"
          className="w-full bg-transparent text-base text-ivory placeholder:text-mute focus:outline-none"
        />
        <kbd className="hidden border hairline px-1.5 text-xs text-mute sm:block">/</kbd>
      </label>

      <AnimatePresence>
        {open && (q || history.length > 0) && (
          <motion.div
            id="search-panel" role="listbox" tabIndex={-1} onMouseDown={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-40 mt-2 max-h-[60vh] overflow-auto border hairline bg-ink-2 text-left shadow-2xl"
          >
            {!q && (
              <div className="p-4">
                <div className="mb-2 flex justify-between text-[11px] uppercase tracking-caps text-mute">
                  <span>{t("search.recent")}</span>
                  <button onClick={clear} className="hover:text-gold">{t("search.clear")}</button>
                </div>
                {history.map((h) => (
                  <button key={h} onClick={() => setQ(h)} className="flex w-full items-center gap-3 py-2 text-sm text-ivory-dim hover:text-gold">
                    <Clock className="h-3.5 w-3.5" /> {h}
                  </button>
                ))}
              </div>
            )}
            {q && groups.length === 0 && <p className="p-5 text-sm text-mute">{t("search.noResults", { q })}</p>}
            {groups.map((g) => (
              <div key={g.k} className="border-b hairline last:border-0">
                <p className="px-5 pt-4 text-[11px] uppercase tracking-caps text-gold">{t(`search.groups.${g.k}`)}</p>
                {g.items.map((d) => {
                  const idx = results.indexOf(d);
                  return (
                    <button
                      key={d.slug} role="option" aria-selected={idx === active} onMouseEnter={() => setActive(idx)} onClick={() => go(d)}
                      className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left ${idx === active ? "bg-ink-3" : ""}`}
                    >
                      <span>
                        <span className="block font-serif text-lg">{d[lang]}</span>
                        <span className="line-clamp-1 text-xs text-mute">{lang === "uz" ? d.meta_uz : d.meta_en}</span>
                      </span>
                      {idx === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-gold" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
