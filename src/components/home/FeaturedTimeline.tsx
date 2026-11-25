import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { scaleLinear } from "d3-scale";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { timelineEvents } from "@/data/events";
import type { EventCategory } from "@/data/types";
import { formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { Section } from "@/components/ui/Section";

const WIDTH = 2600;
const PAD = 130;
/** Piecewise scale: compresses deep antiquity, gives recent centuries room. */
const x = scaleLinear().domain([-3300, -500, 500, 1400, 1800, 2030]).range([PAD, 620, 1150, 1700, 2200, WIDTH - PAD]);
const TICKS = [-3000, -2000, -1000, -500, 0, 500, 1000, 1200, 1400, 1600, 1800, 1900, 2000];

export function FeaturedTimeline() {
  const { t, lang } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState<EventCategory | "all">("all");
  const cats = useMemo(() => ["all", ...new Set(timelineEvents.map((e) => e.category))] as const, []);
  const scroll = (d: number) => track.current?.scrollBy({ left: d * 480, behavior: "smooth" });
  const drag = useRef<{ x: number; l: number } | null>(null);

  const tick = (y: number) => (y === 0 ? (lang === "uz" ? "Milodiy" : "CE") : y < 0 ? `${-y} ${lang === "uz" ? "m.a." : "BCE"}` : String(y));

  return (
    <Section eyebrow={t("sections.timeline.eyebrow")} title={t("sections.timeline.title")} lead={t("sections.timeline.lead")}
      action={{ to: "/timeline", label: t("sections.timeline.all") }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c as typeof cat)} aria-pressed={cat === c}
              className={`border px-3 py-1.5 text-xs transition-colors ${cat === c ? "border-gold text-gold" : "border-ink-line text-mute hover:text-ivory"}`}>
              {c === "all" ? "∗" : t(`categories.${c}`)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Earlier" className="border hairline p-2 hover:border-gold hover:text-gold"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll(1)} aria-label="Later" className="border hairline p-2 hover:border-gold hover:text-gold"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div
        ref={track} className="no-scrollbar relative cursor-grab overflow-x-auto active:cursor-grabbing"
        onPointerDown={(e) => { drag.current = { x: e.clientX, l: track.current!.scrollLeft }; }}
        onPointerMove={(e) => { if (drag.current && track.current) track.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x); }}
        onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)}
      >
        <div className="relative h-[340px]" style={{ width: WIDTH }}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-ink-line" />
          {TICKS.map((y) => (
            <div key={y} className="absolute top-1/2 -translate-x-1/2" style={{ left: x(y) }}>
              <div className="h-3 w-px bg-mute/50" />
              <span className="mt-2 block whitespace-nowrap text-[11px] tracking-wider text-mute">{tick(y)}</span>
            </div>
          ))}
          {timelineEvents.map((e, i) => {
            const up = i % 2 === 0, on = cat === "all" || cat === e.category;
            return (
              <motion.div key={e.slug} className="absolute w-52 -translate-x-1/2" style={{ left: x(e.date.year), [up ? "bottom" : "top"]: "calc(50% + 10px)" }}
                animate={{ opacity: on ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <Link to={`/events/${e.slug}`} tabIndex={on ? 0 : -1} draggable={false}
                  className={`group flex flex-col ${up ? "" : "flex-col-reverse"} items-center text-center`}>
                  <span className="mb-2 px-2">
                    <span className="block text-[11px] text-gold">{formatDate(e.date, lang)}</span>
                    <span className="mt-1 block font-serif text-lg leading-tight transition-colors group-hover:text-gold">{tr(e.title, lang)}</span>
                  </span>
                  <span className={`block w-px bg-gold/40 ${up ? "h-6" : "h-6"}`} />
                  <span className={`block h-2.5 w-2.5 rotate-45 border border-gold transition-colors group-hover:bg-gold ${up ? "" : "mb-0"}`} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
