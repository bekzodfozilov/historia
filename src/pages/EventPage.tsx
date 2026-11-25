import { Link, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { allEvents } from "@/data/events";
import { civilizations } from "@/data/civilizations";
import { civEvents } from "@/data/links";
import { formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Field, Sources } from "@/components/shared/Page";
import NotFound from "./NotFound";

export default function EventPage() {
  const { slug = "" } = useParams();
  const { t, lang } = useLang();
  const e = allEvents.find((x) => x.slug === slug);
  if (!e) return <NotFound />;
  const related = allEvents
    .filter((x) => x.slug !== e.slug && (x.continent === e.continent || x.category === e.category))
    .sort((a, b) => Math.abs(a.date.year - e.date.year) - Math.abs(b.date.year - e.date.year)).slice(0, 5);
  const civs = civilizations.filter((c) => civEvents[c.slug]?.includes(e.slug));

  return (
    <>
      <PageHeader eyebrow={formatDate(e.date, lang)} title={tr(e.title, lang)} lead={tr(e.summary, lang)} back={{ to: "/events", label: t("nav.events") }}>
        <Link to={`/timeline?year=${e.date.year}`} className="mt-8 inline-flex items-center gap-2 border border-gold px-4 py-2 text-sm text-gold hover:bg-gold hover:text-ink"><Clock className="h-4 w-4" />{t("eventsPage.viewTimeline")}</Link>
      </PageHeader>
      <div className="container-page grid gap-14 pb-24 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
          {civs.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4">{t("nav.civilizations")}</h2>
              <ul className="flex flex-wrap gap-3">{civs.map((c) => <li key={c.slug}><Link to={`/civilizations/${c.slug}`} className="block border hairline px-4 py-2 font-serif text-lg hover:border-gold hover:text-gold">{tr(c.name, lang)}</Link></li>)}</ul>
            </section>
          )}
          <section>
            <h2 className="eyebrow mb-4">{t("eventsPage.related")}</h2>
            <ul className="divide-y divide-ink-line border-y hairline">
              {related.map((r) => <li key={r.slug}><Link to={`/events/${r.slug}`} className="group flex justify-between gap-4 py-3"><span className="font-serif text-xl group-hover:text-gold">{tr(r.title, lang)}</span><span className="whitespace-nowrap text-sm text-gold">{formatDate(r.date, lang)}</span></Link></li>)}
            </ul>
          </section>
        </div>
        <aside className="space-y-12 lg:col-span-4">
          <dl>
            <Field label={t("eventsPage.date")}>{formatDate(e.date, lang)}</Field>
            <Field label={t("eventsPage.category")}><Link to={`/events?category=${e.category}`} className="text-gold link-underline">{t(`categories.${e.category}`)}</Link></Field>
            <Field label={t("eventsPage.continent")}><Link to={`/events?continent=${e.continent}`} className="text-gold link-underline">{t(`continents.${e.continent}`)}</Link></Field>
          </dl>
          <Sources items={e.sources} />
        </aside>
      </div>
    </>
  );
}
