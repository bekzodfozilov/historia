import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { scaleLinear } from "d3-scale";
import { allEvents } from "@/data/events";
import { civilizations } from "@/data/civilizations";
import type { EventCategory } from "@/data/types";
import { CONTINENTS } from "@/data/countries";
import { formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Chip, inputCls } from "@/components/shared/Page";

const MIN = -3500, MAX = 2030;
const CATS: EventCategory[] = ["politics", "wars", "science", "technology", "culture", "religion", "geography", "discoveries"];
const LANE = 64;

function clampDomain(a: number, b: number): [number, number] {
  const span = Math.min(Math.max(b - a, 10), MAX - MIN);
  let s = a; if (s < MIN) s = MIN; if (s + span > MAX) s = MAX - span;
  return [s, s + span];
}

export default function TimelinePage() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const [dom, setDom] = useState<[number, number]>(() => {
    const y = Number(params.get("year"));
    return params.get("year") && !isNaN(y) ? clampDomain(y - 60, y + 60) : [MIN, MAX];
  });
  const [cats, setCats] = useState<Set<EventCategory>>(new Set());
  const [conts, setConts] = useState<Set<string>>(new Set());
  const [yearInput, setYearInput] = useState(params.get("year") ?? "");
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1000);
  const drag = useRef<{ x: number; d: [number, number] } | null>(null);
  const focusRaw = params.get("year") ? Number(params.get("year")) : NaN;
  const focus = Number.isFinite(focusRaw) ? focusRaw : null;

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    box.current && ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const x = useMemo(() => scaleLinear().domain(dom).range([0, w]), [dom, w]);
  const clamp = clampDomain;

  useEffect(() => {
    const el = box.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const at = x.invert(e.clientX - r.left);
      const f = Math.exp(e.deltaY * 0.0015);
      setDom(([a, b]) => clamp(at - (at - a) * f, at + (b - at) * f));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [x]);

  const toggle = <T,>(s: Set<T>, v: T, f: (n: Set<T>) => void) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); f(n); };
  const visible = allEvents.filter((e) => (!cats.size || cats.has(e.category)) && (!conts.size || conts.has(e.continent)));
  const inView = visible.filter((e) => e.date.year >= dom[0] && e.date.year <= dom[1]);
  const lanes = CONTINENTS.filter((c) => !conts.size || conts.has(c));

  const ticks = x.ticks(Math.max(4, Math.floor(w / 110)));
  const lab = (y: number) => (y < 0 ? `${-y} ${lang === "uz" ? "m.a." : "BCE"}` : String(y));

  const jump = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(yearInput, 10);
    if (isNaN(y)) return;
    setDom(clamp(y - 60, y + 60));
    setParams({ year: String(y) }, { replace: true });
  };
  const R = 25;
  const nearby = focus !== null ? visible.filter((e) => Math.abs(e.date.year - focus) <= R) : [];

  return (
    <>
      <PageHeader eyebrow={t("nav.timeline")} title={t("timelinePage.title")} lead={t("timelinePage.lead")} />
      <div className="container-page pb-24">
        <div className="mb-6 space-y-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {CONTINENTS.map((c) => <Chip key={c} active={conts.has(c)} onClick={() => toggle(conts, c, setConts)}>{t(`continents.${c}`)}</Chip>)}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {CATS.map((c) => <Chip key={c} active={cats.has(c)} onClick={() => toggle(cats, c, setCats)}>{t(`categories.${c}`)}</Chip>)}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-mute">
          <span>{lab(Math.round(dom[0]))} — {lab(Math.round(dom[1]))} · {t("timelinePage.count", { n: inView.length })}</span>
          <div className="flex gap-2">
            <button className="border hairline px-3 py-1.5 hover:border-gold hover:text-gold" onClick={() => setDom(([a, b]) => clamp(a + (b - a) * 0.25, b - (b - a) * 0.25))}>+ {t("timelinePage.zoom")}</button>
            <button className="border hairline px-3 py-1.5 hover:border-gold hover:text-gold" onClick={() => setDom(([a, b]) => clamp(a - (b - a) * 0.5, b + (b - a) * 0.5))}>− {t("timelinePage.zoom")}</button>
            <button className="border hairline px-3 py-1.5 hover:border-gold hover:text-gold" onClick={() => { setDom([MIN, MAX]); setParams({}, { replace: true }); }}>{t("explore.reset")}</button>
          </div>
        </div>

        <div ref={box} className="relative select-none overflow-hidden border hairline bg-ink-2 cursor-grab active:cursor-grabbing touch-none"
          style={{ height: 40 + 36 + lanes.length * LANE + 24 }}
          onPointerDown={(e) => { (e.target as Element).closest("a") || (drag.current = { x: e.clientX, d: dom }); }}
          onPointerMove={(e) => { if (!drag.current) return; const dy = (e.clientX - drag.current.x) * (drag.current.d[1] - drag.current.d[0]) / w; setDom(clamp(drag.current.d[0] - dy, drag.current.d[1] - dy)); }}
          onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)}>
          {ticks.map((y) => (
            <div key={y} className="absolute bottom-0 top-0 border-l border-ink-line" style={{ left: x(y) }}>
              <span className="absolute top-2 ml-1.5 whitespace-nowrap text-[10px] text-mute">{lab(y)}</span>
            </div>
          ))}
          {focus !== null && <div className="absolute bottom-0 top-0 w-px bg-gold" style={{ left: x(focus) }} />}
          {/* civilizations band */}
          <div className="absolute inset-x-0" style={{ top: 30, height: 36 }}>
            {civilizations.map((c, i) => {
              const l = x(c.start.year), r = x(c.end.year);
              if (r < 0 || l > w) return null;
              return (
                <Link key={c.slug} to={`/civilizations/${c.slug}`} title={tr(c.name, lang)}
                  className="absolute truncate border border-gold/40 bg-gold/10 px-1.5 text-[10px] leading-[14px] text-gold hover:bg-gold hover:text-ink"
                  style={{ left: Math.max(0, l), width: Math.max(4, Math.min(w, r) - Math.max(0, l)), top: (i % 2) * 17 }}>
                  {tr(c.name, lang)}
                </Link>
              );
            })}
          </div>
          {lanes.map((c, li) => (
            <div key={c} className="absolute inset-x-0 border-t border-ink-line/60" style={{ top: 76 + li * LANE, height: LANE }}>
              <span className="absolute left-2 top-1 text-[10px] uppercase tracking-caps text-mute/70">{t(`continents.${c}`)}</span>
              {inView.filter((e) => e.continent === c).map((e, i) => (
                <Link key={e.slug} to={`/events/${e.slug}`} draggable={false}
                  className="group absolute flex -translate-x-[5px] items-center gap-1.5" style={{ left: x(e.date.year), top: 20 + (i % 2) * 18 }}>
                  <span className="h-2.5 w-2.5 shrink-0 rotate-45 border border-gold bg-ink-2 group-hover:bg-gold" />
                  <span className="max-w-[180px] truncate text-xs text-ivory-dim group-hover:text-gold">{tr(e.title, lang)}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <section className="mt-16 grid gap-10 md:grid-cols-12">
          <form onSubmit={jump} className="md:col-span-4">
            <h2 className="font-serif text-3xl">{t("timelinePage.year")}</h2>
            <div className="mt-5 flex gap-2">
              <input type="number" value={yearInput} onChange={(e) => setYearInput(e.target.value)} placeholder={t("timelinePage.yearPh")} className={inputCls} aria-label={t("timelinePage.year")} />
              <button className="bg-gold px-5 text-sm font-medium text-ink hover:bg-gold-soft">{t("timelinePage.go")}</button>
            </div>
          </form>
          <div className="md:col-span-8">
            {focus !== null && (
              <>
                <p className="eyebrow mb-4">{t("timelinePage.nearby", { r: R, y: lab(focus) })}</p>
                {nearby.length === 0 ? <p className="text-mute">{t("timelinePage.noneNear", { r: R, y: lab(focus) })}</p> : (
                  <ul className="divide-y divide-ink-line border-y hairline">
                    {nearby.map((e) => (
                      <li key={e.slug}><Link to={`/events/${e.slug}`} className="group grid grid-cols-[7rem_1fr] gap-4 py-3">
                        <span className="text-sm text-gold">{formatDate(e.date, lang)}</span>
                        <span><span className="font-serif text-xl group-hover:text-gold">{tr(e.title, lang)}</span> <span className="text-xs text-mute">· {t(`continents.${e.continent}`)}</span></span>
                      </Link></li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
