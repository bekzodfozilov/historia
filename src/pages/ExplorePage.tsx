import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { geoEqualEarth, geoPath, geoGraticule10 } from "d3-geo";
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import { select } from "d3-selection";
import "d3-transition";
import { Plus, Minus, RotateCcw, X, ArrowRight, GitCompare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { worldFeatures } from "@/lib/worldGeo";
import { byCca3, countryName, type Country } from "@/data/countries";
import { civilizations } from "@/data/civilizations";
import { civProfiles } from "@/data/civProfiles";
import { countryHistory } from "@/data/countryHistory";
import { formatRange, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, selectCls } from "@/components/shared/Page";

const W = 960, H = 500;

function CountryCard({ c, onClose }: { c: Country; onClose: () => void }) {
  const { t, lang } = useLang();
  const loc = lang === "uz" ? "uz-UZ" : "en-GB";
  return (
    <div className="border hairline bg-ink-2 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-3xl">{c.flag}</span>
          <h2 className="mt-2 font-serif text-3xl leading-tight">{countryName(c, lang)}</h2>
          <p className="text-xs text-mute">{t(`continents.${c.continent}`)}{c.subregion ? ` · ${c.subregion}` : ""}</p>
        </div>
        <button onClick={onClose} aria-label={t("explore.clear")} className="p-1 text-mute hover:text-gold"><X className="h-4 w-4" /></button>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><dt className="text-[10px] uppercase tracking-caps text-mute">{t("countries.capital")}</dt><dd>{c.capital[0] ?? "—"}</dd></div>
        <div><dt className="text-[10px] uppercase tracking-caps text-mute">{t("countries.area")}</dt><dd>{Math.round(c.area).toLocaleString(loc)} km²</dd></div>
      </dl>
      {countryHistory[c.cca3] && <p className="mt-4 line-clamp-3 text-sm text-ivory-dim">{tr(countryHistory[c.cca3].overview, lang)}</p>}
      <Link to={`/countries/${c.cca3.toLowerCase()}`} className="mt-5 inline-flex items-center gap-2 text-sm text-gold"><span className="link-underline">{t("explore.profile")}</span><ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}

export default function ExplorePage() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const sel = params.get("c")?.toUpperCase() ?? "";
  const cmp = params.get("vs")?.toUpperCase() ?? "";
  const layer = params.get("layer") ?? "";
  const [comparing, setComparing] = useState(!!cmp);
  const [hover, setHover] = useState<string | null>(null);
  const [k, setK] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zb = useRef<ZoomBehavior<SVGSVGElement, unknown>>();

  const set = (patch: Record<string, string>) => { const p = new URLSearchParams(params); Object.entries(patch).forEach(([a, v]) => (v ? p.set(a, v) : p.delete(a))); setParams(p, { replace: true }); };

  const { paths, grat, path } = useMemo(() => {
    const feats = worldFeatures();
    const proj = geoEqualEarth().fitSize([W, H], { type: "FeatureCollection", features: feats.map((f) => f.feature) } as any);
    const path = geoPath(proj);
    return { paths: feats.map((f) => ({ ...f, d: path(f.feature) ?? "" })), grat: path(geoGraticule10()) ?? "", path };
  }, []);

  const highlighted = useMemo(() => new Set(layer ? civProfiles[layer]?.countries ?? [] : []), [layer]);

  useEffect(() => {
    if (!svgRef.current) return;
    const z = d3zoom<SVGSVGElement, unknown>().scaleExtent([1, 12]).translateExtent([[0, 0], [W, H]])
      .on("zoom", (e) => { gRef.current?.setAttribute("transform", e.transform.toString()); setK(e.transform.k); });
    zb.current = z;
    select(svgRef.current).call(z);
  }, []);

  // fly to selected country
  useEffect(() => {
    const f = paths.find((p) => p.country?.cca3 === sel);
    if (!f || !svgRef.current || !zb.current) return;
    const [[x0, y0], [x1, y1]] = path.bounds(f.feature);
    const s = Math.min(8, 0.6 / Math.max((x1 - x0) / W, (y1 - y0) / H));
    const tr = zoomIdentity.translate(W / 2, H / 2).scale(Math.max(1, s)).translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
    select(svgRef.current).transition().duration(750).call(zb.current.transform as any, tr);
  }, [sel, paths, path]);

  const zoomBy = (f: number) => svgRef.current && zb.current && select(svgRef.current).transition().duration(300).call(zb.current.scaleBy as any, f);
  const reset = () => svgRef.current && zb.current && select(svgRef.current).transition().duration(500).call(zb.current.transform as any, zoomIdentity);

  const onPick = (c?: Country) => {
    if (!c) return;
    if (comparing && sel && c.cca3 !== sel) set({ vs: c.cca3.toLowerCase() });
    else set({ c: c.cca3.toLowerCase(), vs: "" });
  };

  const A = byCca3.get(sel), B = byCca3.get(cmp);
  const civ = civilizations.find((c) => c.slug === layer);

  return (
    <>
      <PageHeader eyebrow={t("nav.explore")} title={t("explore.title")} lead={t("explore.lead")} />
      <div className="container-page grid gap-6 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="text-xs uppercase tracking-caps text-mute" htmlFor="layer">{t("explore.layer")}</label>
            <select id="layer" value={layer} onChange={(e) => set({ layer: e.target.value })} className={selectCls}>
              <option value="">{t("explore.layerNone")}</option>
              {civilizations.map((c) => <option key={c.slug} value={c.slug}>{tr(c.name, lang)} ({formatRange(c.start, c.end, lang)})</option>)}
            </select>
            {civ && <Link to={`/civilizations/${civ.slug}`} className="text-sm text-gold link-underline">{tr(civ.name, lang)} →</Link>}
          </div>
          {layer && <p className="mb-4 border-l-2 border-[#D9A877] pl-3 text-xs text-mute">{t("explore.layerNote")}</p>}

          <div className="relative overflow-hidden border hairline bg-ink">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block w-full cursor-grab touch-none active:cursor-grabbing" role="img" aria-label={t("explore.title")}>
              <g ref={gRef}>
                <path d={grat} fill="none" stroke="#C5A46D" strokeOpacity="0.07" strokeWidth={0.5 / k} />
                {paths.map((p) => {
                  const id = p.country?.cca3;
                  const isSel = id && (id === sel || id === cmp);
                  const isHl = id && highlighted.has(id);
                  const fill = isSel ? "#C5A46D" : hover === p.key ? "#3A3D40" : isHl ? "#6B5A3C" : "#25282B";
                  return (
                    <path key={p.key} d={p.d} fill={fill} stroke="#111315" strokeWidth={0.5 / k}
                      className={p.country ? "cursor-pointer transition-[fill] duration-200" : ""}
                      onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)} onClick={() => onPick(p.country)}>
                      <title>{p.country ? countryName(p.country, lang) : p.name}</title>
                    </path>
                  );
                })}
              </g>
            </svg>
            <div className="absolute right-3 top-3 flex flex-col border hairline bg-ink/90">
              <button onClick={() => zoomBy(1.6)} aria-label={t("explore.zoomIn")} className="p-2 hover:text-gold"><Plus className="h-4 w-4" /></button>
              <button onClick={() => zoomBy(1 / 1.6)} aria-label={t("explore.zoomOut")} className="border-y hairline p-2 hover:text-gold"><Minus className="h-4 w-4" /></button>
              <button onClick={reset} aria-label={t("explore.reset")} className="p-2 hover:text-gold"><RotateCcw className="h-4 w-4" /></button>
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 border hairline bg-ink/90 px-3 py-2 font-serif text-lg text-gold">
              {hover ? (() => { const p = paths.find((x) => x.key === hover)!; return p.country ? `${p.country.flag} ${countryName(p.country, lang)}` : p.name; })() : t("explore.pick")}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
          <AnimatePresence mode="popLayout">
            {A ? (
              <motion.div key={A.cca3} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <CountryCard c={A} onClose={() => set({ c: "", vs: "" })} />
              </motion.div>
            ) : (
              <p className="border border-dashed border-ink-line p-6 text-sm text-mute">{t("explore.pick")}</p>
            )}
          </AnimatePresence>
          {A && (
            <button onClick={() => { setComparing((v) => !v); set({ vs: "" }); }}
              className={`flex w-full items-center justify-center gap-2 border px-4 py-3 text-sm ${comparing ? "border-gold text-gold" : "border-ink-line text-ivory-dim hover:border-gold"}`}>
              <GitCompare className="h-4 w-4" />{comparing ? t("explore.clear") : t("explore.compare")}
            </button>
          )}
          {comparing && A && !B && <p className="text-sm text-mute">{t("explore.compareWith")}</p>}
          {comparing && B && <CountryCard c={B} onClose={() => set({ vs: "" })} />}
          {A && B && (
            <table className="w-full border hairline text-sm">
              <tbody>
                {[
                  [t("countries.area"), (c: Country) => `${Math.round(c.area).toLocaleString(lang === "uz" ? "uz-UZ" : "en-GB")} km²`],
                  [t("countries.capital"), (c: Country) => c.capital[0] ?? "—"],
                  [t("countries.borders"), (c: Country) => String(c.borders.length)],
                  [t("countries.empires"), (c: Country) => String(civilizations.filter((x) => civProfiles[x.slug]?.countries.includes(c.cca3)).length)],
                ].map(([label, fn]) => (
                  <tr key={label as string} className="border-b hairline last:border-0">
                    <th className="p-2 text-left text-[10px] font-normal uppercase tracking-caps text-mute">{label as string}</th>
                    <td className="p-2">{(fn as (c: Country) => string)(A)}</td>
                    <td className="p-2 text-gold">{(fn as (c: Country) => string)(B)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </aside>
      </div>
    </>
  );
}
