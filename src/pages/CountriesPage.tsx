import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { countries, countryName, CONTINENTS } from "@/data/countries";
import { countryHistory } from "@/data/countryHistory";
import { civilizations } from "@/data/civilizations";
import { civProfiles } from "@/data/civProfiles";
import { tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Chip, Empty, inputCls, selectCls } from "@/components/shared/Page";
import { Tag } from "@/components/ui/Section";

export default function CountriesPage() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cont = params.get("continent") ?? "all";
  const period = params.get("period") ?? "";
  const sort = params.get("sort") ?? "az";
  const set = (k: string, v: string) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }); };

  const list = useMemo(() => {
    const periodSet = period ? new Set(civProfiles[period]?.countries ?? []) : null;
    const needle = q.trim().toLowerCase();
    const r = countries.filter((c) =>
      (cont === "all" || c.continent === cont) &&
      (!periodSet || periodSet.has(c.cca3)) &&
      (!needle || c.nameEn.toLowerCase().includes(needle) || countryName(c, "uz").toLowerCase().includes(needle) || c.capital.some((x) => x.toLowerCase().includes(needle))));
    const name = (c: typeof r[number]) => countryName(c, lang);
    if (sort === "za") r.sort((a, b) => name(b).localeCompare(name(a), lang));
    else if (sort === "area") r.sort((a, b) => b.area - a.area);
    else r.sort((a, b) => name(a).localeCompare(name(b), lang));
    return r;
  }, [q, cont, period, sort, lang]);

  return (
    <>
      <PageHeader eyebrow={t("nav.countries")} title={t("countries.title")} lead={t("countries.lead", { n: countries.length })} />
      <div className="container-page pb-24">
        <div className="sticky top-[72px] z-20 -mx-5 mb-8 space-y-4 border-b hairline bg-ink/95 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
              <input value={q} onChange={(e) => set("q", e.target.value)} placeholder={t("countries.search")} aria-label={t("countries.search")} className={`${inputCls} pl-11`} />
            </label>
            <select value={period} onChange={(e) => set("period", e.target.value)} aria-label={t("countries.period")} className={selectCls}>
              <option value="">{t("countries.period")}: {t("countries.anyPeriod")}</option>
              {civilizations.map((c) => <option key={c.slug} value={c.slug}>{tr(c.name, lang)}</option>)}
            </select>
            <select value={sort} onChange={(e) => set("sort", e.target.value)} aria-label="Sort" className={selectCls}>
              <option value="az">{t("countries.sortAZ")}</option>
              <option value="za">{t("countries.sortZA")}</option>
              <option value="area">{t("countries.sortArea")}</option>
            </select>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <Chip active={cont === "all"} onClick={() => set("continent", "")}>{t("continents.all")}</Chip>
            {CONTINENTS.map((c) => <Chip key={c} active={cont === c} onClick={() => set("continent", c)}>{t(`continents.${c}`)}</Chip>)}
          </div>
        </div>

        <p className="mb-6 text-sm text-mute">{t("countries.results", { n: list.length })}</p>
        {list.length === 0 ? (
          <Empty text={t("countries.empty")} action={{ label: t("countries.reset"), onClick: () => setParams({}) }} />
        ) : (
          <ul className="grid gap-px bg-ink-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((c) => (
              <li key={c.cca3}>
                <Link to={`/countries/${c.cca3.toLowerCase()}`} className="group flex h-full flex-col gap-4 bg-ink p-6 transition-colors hover:bg-ink-2">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl leading-none" aria-hidden>{c.flag}</span>
                    {countryHistory[c.cca3] && <Tag tone="gold">{t("countries.curated")}</Tag>}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl leading-tight transition-colors group-hover:text-gold">{countryName(c, lang)}</h2>
                    <p className="mt-1 text-xs text-mute">{t(`continents.${c.continent}`)}{c.capital[0] ? ` · ${c.capital[0]}` : ""}</p>
                  </div>
                  <p className="mt-auto text-xs text-mute">{Math.round(c.area).toLocaleString(lang === "uz" ? "uz-UZ" : "en-GB")} km²</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
