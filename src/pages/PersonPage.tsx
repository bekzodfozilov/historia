import { Link, useParams } from "react-router-dom";
import { people } from "@/data/people";
import { civilizations } from "@/data/civilizations";
import { byCca3, countryName } from "@/data/countries";
import { personCiv, personCountry, personContext, relatedPeople } from "@/data/links";
import { formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Field, Sources } from "@/components/shared/Page";
import { initials } from "./PeoplePage";
import NotFound from "./NotFound";

export default function PersonPage() {
  const { slug = "" } = useParams();
  const { t, lang } = useLang();
  const p = people.find((x) => x.slug === slug);
  if (!p) return <NotFound />;
  const country = byCca3.get(personCountry[p.slug] ?? "");
  const civ = civilizations.find((c) => c.slug === personCiv[p.slug]);
  const rel = (relatedPeople[p.slug] ?? []).map((s) => people.find((x) => x.slug === s)!).filter(Boolean);
  const ctx = personContext[p.slug];

  return (
    <>
      <PageHeader eyebrow={t(`cats.${p.category}`)} title={tr(p.name, lang)} lead={tr(p.summary, lang)} back={{ to: "/people", label: t("nav.people") }} />
      <div className="container-page grid gap-14 pb-24 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
          <div className="grid aspect-[4/3] max-w-md place-items-center border border-gold/30 bg-ink-2 font-serif text-[8rem] text-gold/40" aria-hidden>{initials(p.name.en)}</div>
          {ctx && <section><h2 className="font-serif text-3xl">{t("peoplePage.context")}</h2><p className="mt-3 max-w-2xl leading-relaxed text-ivory-dim">{tr(ctx, lang)}</p></section>}
          {rel.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4">{t("peoplePage.related")}</h2>
              <ul className="flex flex-wrap gap-3">{rel.map((r) => <li key={r.slug}><Link to={`/people/${r.slug}`} className="block border hairline px-4 py-2 font-serif text-lg hover:border-gold hover:text-gold">{tr(r.name, lang)}</Link></li>)}</ul>
            </section>
          )}
        </div>
        <aside className="space-y-12 lg:col-span-4">
          <dl>
            <Field label={t("peoplePage.born")}>{formatDate(p.born, lang)}</Field>
            <Field label={t("peoplePage.died")}>{formatDate(p.died, lang)}</Field>
            <Field label={t("cats." + p.category)}>{tr(p.role, lang)}</Field>
            {country && <Field label={t("peoplePage.country")}><Link to={`/countries/${country.cca3.toLowerCase()}`} className="text-gold link-underline">{country.flag} {countryName(country, lang)}</Link></Field>}
            {civ && <Field label={t("nav.civilizations")}><Link to={`/civilizations/${civ.slug}`} className="text-gold link-underline">{tr(civ.name, lang)}</Link></Field>}
          </dl>
          <Sources items={p.sources} />
        </aside>
      </div>
    </>
  );
}
