import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarX } from "lucide-react";
import { onThisDay } from "@/data/events";
import { monthName, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { Section, Tag } from "@/components/ui/Section";

const key = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function OnThisDay() {
  const { t, lang } = useLang();
  const [day, setDay] = useState(() => new Date());
  const shift = (n: number) => setDay((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
  const events = [...(onThisDay[key(day)] ?? [])].sort((a, b) => a.date.year - b.date.year);
  const label = lang === "uz" ? `${day.getDate()}-${monthName(day.getMonth() + 1, "uz")}` : `${day.getDate()} ${monthName(day.getMonth() + 1, "en")}`;

  return (
    <Section eyebrow={t("sections.today.eyebrow")} title={t("sections.today.title", { date: label })}>
      <div className="mb-8 flex gap-2">
        <button onClick={() => shift(-1)} className="inline-flex items-center gap-1 border hairline px-3 py-2 text-xs text-mute hover:border-gold hover:text-gold"><ChevronLeft className="h-3.5 w-3.5" />{t("sections.today.prev")}</button>
        <button onClick={() => shift(1)} className="inline-flex items-center gap-1 border hairline px-3 py-2 text-xs text-mute hover:border-gold hover:text-gold">{t("sections.today.next")}<ChevronRight className="h-3.5 w-3.5" /></button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={key(day)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {events.length === 0 ? (
            <div className="flex items-center gap-5 border border-dashed border-ink-line p-10 text-mute">
              <CalendarX className="h-8 w-8 shrink-0 text-gold/60" />
              <p className="max-w-lg">{t("sections.today.empty")}</p>
            </div>
          ) : (
            <div className="grid gap-px bg-ink-line md:grid-cols-3">
              {events.map((e) => (
                <Link key={e.slug} to={`/events/${e.slug}`} className="group flex flex-col gap-4 bg-ink p-7 transition-colors hover:bg-ink-2">
                  <span className="font-serif text-6xl text-gold">{e.date.year}</span>
                  <Tag>{t(`categories.${e.category}`)}</Tag>
                  <h3 className="font-serif text-2xl leading-tight group-hover:text-gold">{tr(e.title, lang)}</h3>
                  <p className="text-sm text-mute">{tr(e.summary, lang)}</p>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
