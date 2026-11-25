import { Link, useParams } from "react-router-dom";
import { MapPin, BookOpen } from "lucide-react";
import { byCca3, countryName } from "@/data/countries";
import { countryHistory } from "@/data/countryHistory";
import { civilizations } from "@/data/civilizations";
import { civProfiles } from "@/data/civProfiles";
import { people } from "@/data/people";
import { personCountry } from "@/data/links";
import { formatRange, formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Field, Sources } from "@/components/shared/Page";
import { Tag } from "@/components/ui/Section";
import NotFound from "./NotFound";

export default function CountryPage() {
  const { code = "" } = useParams();
  const { t, lang } = useLang();
  const c = byCca3.get(code.toUpperCase());
  if (!c) return <NotFound />;
  const h = countryHistory[c.cca3];
  const civs = civilizations.filter((x) => civProfiles[x.slug]?.countries.includes(c.cca3));
  const figs = people.filter((p) => personCountry[p.slug] === c.cca3);
  const loc = lang === "uz" ? "uz-UZ" : "en-GB";

  return (
    <>
      <PageHeader eyebrow={`${c.flag}  ${t(`continents.${c.continent}`)}`} title={countryName(c, lang)} lead={h ? tr(h.overview, lang) : c.official}
        back={{ to: "/countries", label: t("nav.countries") }}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={`/explore?c=${c.cca3.toLowerCase()}`} className="inline-flex items-center gap-2 border border-gold px-4 py-2 text-sm text-gold hover:bg-gold hover:text-ink"><MapPin className="h-4 w-4" />{t("countries.onMap")}</Link>
        </div>
      </PageHeader>

      <div className="container-page grid gap-14 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {h ? (
            <>
              <nav aria-label="Sections" className="no-scrollbar mb-10 flex gap-6 overflow-x-auto border-b hairline pb-3 text-sm">
                {h.sections.map((s) => <a key={s.key} href={`#${s.key}`} className="whitespace-nowrap text-mute hover:text-gold">{t(`countries.sections.${s.key}`)}</a>)}
              </nav>
              <ol className="relative space-y-12 border-l border-gold/30 pl-8">
                {h.sections.map((s, i) => (
                  <li key={s.key} id={s.key} className="relative scroll-mt-28">
                    <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rotate-45 border border-gold bg-ink" />
                    <p className="eyebrow mb-2">{String(i + 1).padStart(2, "0")}</p>
                    <h2 className="font-serif text-3xl">{t(`countries.sections.${s.key}`)}</h2>
                    <p className="mt-3 max-w-2xl leading-relaxed text-ivory-dim">{tr(s.text, lang)}</p>
                  </li>
                ))}
              </ol>
              {h.disputed && <aside className="mt-10 border-l-2 border-[#D9A877] bg-ink-2 p-5 text-sm"><Tag tone="warn">{t("sections.civs.disputed")}</Tag><p className="mt-2">{tr(h.disputed, lang)}</p></aside>}
              <section className="mt-16">
                <h2 className="eyebrow mb-5">{t("countries.places")}</h2>
                <ul className="grid gap-px bg-ink-line sm:grid-cols-2">
                  {h.places.map((p) => <li key={p.en} className="flex items-center gap-3 bg-ink-2 p-5 font-serif text-xl"><MapPin className="h-4 w-4 shrink-0 text-gold" />{tr(p, lang)}</li>)}
                </ul>
              </section>
            </>
          ) : (
            <div className="border border-dashed border-ink-line p-8">
              <BookOpen className="mb-4 h-7 w-7 text-gold/70" />
              <h2 className="font-serif text-3xl">{t("countries.noHistoryTitle")}</h2>
              <p className="mt-3 max-w-xl text-mute">{t("countries.noHistoryBody")}</p>
            </div>
          )}

          <section className="mt-16">
            <h2 className="eyebrow mb-5">{t("countries.empires")}</h2>
            {civs.length === 0 ? <p className="text-sm text-mute">{t("countries.none")}</p> : (
              <ul className="divide-y divide-ink-line border-y hairline">
                {civs.map((x) => (
                  <li key={x.slug}><Link to={`/civilizations/${x.slug}`} className="group flex flex-wrap items-baseline justify-between gap-2 py-4">
                    <span className="font-serif text-2xl group-hover:text-gold">{tr(x.name, lang)}</span>
                    <span className="text-xs text-gold">{formatRange(x.start, x.end, lang)}</span>
                  </Link></li>
                ))}
              </ul>
            )}
          </section>

          {figs.length > 0 && (
            <section className="mt-16">
              <h2 className="eyebrow mb-5">{t("nav.people")}</h2>
              <ul className="flex flex-wrap gap-3">
                {figs.map((p) => <li key={p.slug}><Link to={`/people/${p.slug}`} className="block border hairline px-4 py-3 hover:border-gold"><span className="font-serif text-lg">{tr(p.name, lang)}</span> <span className="text-xs text-mute">{formatDate(p.born, lang)} — {formatDate(p.died, lang)}</span></Link></li>)}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-12 lg:col-span-4">
          <dl>
            <Field label={t("countries.capital")}>{c.capital.join(", ") || "—"}</Field>
            <Field label={t("countries.region")}>{c.subregion || c.region}</Field>
            <Field label={t("countries.area")}>{Math.round(c.area).toLocaleString(loc)} km²</Field>
            <Field label={t("countries.languages")}>{c.languages.join(", ") || "—"}</Field>
            <Field label={t("countries.status")}>
              {c.independent ? t("countries.independent") : t("countries.territory")}{c.unMember ? ` · ${t("countries.un")}` : ""}{c.landlocked ? ` · ${t("countries.landlocked")}` : ""}
            </Field>
            <Field label={t("countries.borders")}>
              {c.borders.length === 0 ? "—" : (
                <span className="flex flex-wrap gap-2">
                  {c.borders.map((b) => { const n = byCca3.get(b); return n ? <Link key={b} to={`/countries/${b.toLowerCase()}`} className="border hairline px-2 py-1 text-xs hover:border-gold hover:text-gold">{n.flag} {countryName(n, lang)}</Link> : null; })}
                </span>
              )}
            </Field>
          </dl>
          <Sources items={[...(h?.sources ?? []), { title: "world-countries dataset (geographic data)", publisher: "mledoze/countries, ODbL", url: "https://github.com/mledoze/countries" }]} />
        </aside>
      </div>
    </>
  );
}
