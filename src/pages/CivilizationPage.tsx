import { Link, useParams } from "react-router-dom";
import { MapPin, GitCompare } from "lucide-react";
import { civilizations } from "@/data/civilizations";
import { civProfiles } from "@/data/civProfiles";
import { allEvents } from "@/data/events";
import { people } from "@/data/people";
import { byCca3, countryName } from "@/data/countries";
import { civEvents, personCiv } from "@/data/links";
import { formatDate, formatRange, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Field, Sources } from "@/components/shared/Page";
import { Tag } from "@/components/ui/Section";
import NotFound from "./NotFound";

export default function CivilizationPage() {
  const { slug = "" } = useParams();
  const { t, lang } = useLang();
  const c = civilizations.find((x) => x.slug === slug);
  if (!c) return <NotFound />;
  const p = civProfiles[c.slug];
  const evs = (civEvents[c.slug] ?? []).map((s) => allEvents.find((e) => e.slug === s)).filter(Boolean) as typeof allEvents;
  const figs = people.filter((x) => personCiv[x.slug] === c.slug);
  const dur = c.end.year - c.start.year;
  const sections = p ? (["political", "economy", "culture", "military", "achievements", "decline"] as const) : [];

  return (
    <>
      <PageHeader eyebrow={formatRange(c.start, c.end, lang)} title={tr(c.name, lang)} lead={tr(c.summary, lang)} back={{ to: "/civilizations", label: t("nav.civilizations") }}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={`/explore?layer=${c.slug}`} className="inline-flex items-center gap-2 border border-gold px-4 py-2 text-sm text-gold hover:bg-gold hover:text-ink"><MapPin className="h-4 w-4" />{t("countries.onMap")}</Link>
          <Link to={`/compare?a=${c.slug}`} className="inline-flex items-center gap-2 border hairline px-4 py-2 text-sm hover:border-gold"><GitCompare className="h-4 w-4" />{t("civsPage.compare")}</Link>
        </div>
      </PageHeader>
      <div className="container-page grid gap-14 pb-24 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
          {c.disputed && (
            <aside className="border-l-2 border-[#D9A877] bg-ink-2 p-5"><Tag tone="warn">{t("sections.civs.disputed")}</Tag><p className="mt-3 text-sm text-ivory-dim">{tr(c.disputed, lang)}</p></aside>
          )}
          {sections.map((k) => (
            <section key={k}>
              <h2 className="font-serif text-3xl">{t(`civsPage.${k}`)}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-ivory-dim">{tr(p![k], lang)}</p>
            </section>
          ))}
          {p && (
            <section>
              <h2 className="font-serif text-3xl">{t("civsPage.rulers")}</h2>
              <ol className="mt-4 flex flex-wrap gap-2">
                {p.rulers.map((r) => {
                  const person = people.find((x) => x.name.en === r.en || x.name.uz === r.uz || x.name.en.startsWith(r.en));
                  return <li key={r.en}>{person ? <Link to={`/people/${person.slug}`} className="block border border-gold/50 px-3 py-1.5 text-sm text-gold hover:bg-gold hover:text-ink">{tr(r, lang)}</Link> : <span className="block border hairline px-3 py-1.5 text-sm">{tr(r, lang)}</span>}</li>;
                })}
              </ol>
            </section>
          )}
          {evs.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4">{t("nav.events")}</h2>
              <ul className="divide-y divide-ink-line border-y hairline">
                {evs.map((e) => <li key={e.slug}><Link to={`/events/${e.slug}`} className="group flex justify-between gap-4 py-3"><span className="font-serif text-xl group-hover:text-gold">{tr(e.title, lang)}</span><span className="text-sm text-gold">{formatDate(e.date, lang)}</span></Link></li>)}
              </ul>
            </section>
          )}
          {figs.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4">{t("nav.people")}</h2>
              <ul className="flex flex-wrap gap-3">{figs.map((f) => <li key={f.slug}><Link to={`/people/${f.slug}`} className="block border hairline px-4 py-2 font-serif text-lg hover:border-gold hover:text-gold">{tr(f.name, lang)}</Link></li>)}</ul>
            </section>
          )}
        </div>
        <aside className="space-y-12 lg:col-span-4">
          <dl>
            <Field label={t("civsPage.founded")}>{formatRange(c.start, c.end, lang)}</Field>
            <Field label={t("civsPage.duration")}>{t("civsPage.years", { n: dur })}</Field>
            <Field label={t("civsPage.extent")}>{tr(c.region, lang)}{c.peakAreaMkm2 ? ` · ~${c.peakAreaMkm2} mln km²` : ""}</Field>
            <Field label={t("sections.civs.capital")}>{tr(c.capital, lang)}</Field>
            {p && (
              <Field label={t("civsPage.modern")}>
                <span className="flex flex-wrap gap-2">
                  {p.countries.map((code) => { const k = byCca3.get(code); return k ? <Link key={code} to={`/countries/${code.toLowerCase()}`} className="border hairline px-2 py-1 text-xs hover:border-gold hover:text-gold">{k.flag} {countryName(k, lang)}</Link> : null; })}
                </span>
              </Field>
            )}
          </dl>
          <Sources items={c.sources} />
        </aside>
      </div>
    </>
  );
}
