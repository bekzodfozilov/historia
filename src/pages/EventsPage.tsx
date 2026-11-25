import { Link, useSearchParams } from "react-router-dom";
import { allEvents } from "@/data/events";
import type { EventCategory } from "@/data/types";
import { CONTINENTS } from "@/data/countries";
import { formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Chip, Empty } from "@/components/shared/Page";
import { Tag } from "@/components/ui/Section";

const CATS: EventCategory[] = ["politics", "wars", "science", "technology", "culture", "religion", "geography", "discoveries"];

export default function EventsPage() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const cat = params.get("category") ?? "all", cont = params.get("continent") ?? "all";
  const set = (k: string, v: string) => { const p = new URLSearchParams(params); v === "all" ? p.delete(k) : p.set(k, v); setParams(p, { replace: true }); };
  const list = allEvents.filter((e) => (cat === "all" || e.category === cat) && (cont === "all" || e.continent === cont));
  return (
    <>
      <PageHeader eyebrow={t("nav.events")} title={t("eventsPage.title")} lead={t("eventsPage.lead")} />
      <div className="container-page pb-24">
        <div className="mb-3 no-scrollbar flex gap-2 overflow-x-auto">
          <Chip active={cat === "all"} onClick={() => set("category", "all")}>{t("eventsPage.all")}</Chip>
          {CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => set("category", c)}>{t(`categories.${c}`)}</Chip>)}
        </div>
        <div className="mb-10 no-scrollbar flex gap-2 overflow-x-auto">
          <Chip active={cont === "all"} onClick={() => set("continent", "all")}>{t("continents.all")}</Chip>
          {CONTINENTS.map((c) => <Chip key={c} active={cont === c} onClick={() => set("continent", c)}>{t(`continents.${c}`)}</Chip>)}
        </div>
        {list.length === 0 ? <Empty text={t("eventsPage.empty")} action={{ label: t("countries.reset"), onClick: () => setParams({}) }} /> : (
          <ol className="divide-y divide-ink-line border-y hairline">
            {list.map((e) => (
              <li key={e.slug}>
                <Link to={`/events/${e.slug}`} className="group grid gap-2 py-5 md:grid-cols-[11rem_1fr_auto] md:items-center md:gap-8">
                  <span className="font-serif text-xl text-gold">{formatDate(e.date, lang)}</span>
                  <span>
                    <span className="block font-serif text-2xl group-hover:text-gold">{tr(e.title, lang)}</span>
                    <span className="block text-sm text-mute">{tr(e.summary, lang)}</span>
                  </span>
                  <span className="flex gap-2"><Tag>{t(`categories.${e.category}`)}</Tag><Tag>{t(`continents.${e.continent}`)}</Tag></span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
