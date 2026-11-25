import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { civilizations } from "@/data/civilizations";
import { civProfiles } from "@/data/civProfiles";
import type { Civilization } from "@/data/types";
import { formatRange, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, selectCls } from "@/components/shared/Page";

const MIN = -3200, MAX = 2000;

export default function ComparePage() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const a = civilizations.find((c) => c.slug === params.get("a")) ?? civilizations.find((c) => c.slug === "roman-empire")!;
  const b = civilizations.find((c) => c.slug === params.get("b") && c.slug !== a.slug) ?? civilizations.find((c) => c.slug !== a.slug && c.slug === "mongol-empire") ?? civilizations.find((c) => c.slug !== a.slug)!;
  const set = (k: "a" | "b", v: string) => { const p = new URLSearchParams(params); p.set("a", a.slug); p.set("b", b.slug); p.set(k, v); setParams(p, { replace: true }); };
  const pct = (y: number) => ((y - MIN) / (MAX - MIN)) * 100;
  const maxArea = Math.max(a.peakAreaMkm2 ?? 0, b.peakAreaMkm2 ?? 0, 1);
  const pa = civProfiles[a.slug], pb = civProfiles[b.slug];

  const Bar = ({ c, tone }: { c: Civilization; tone: string }) => (
    <div className="relative h-6">
      <motion.div layout className={`absolute h-full ${tone}`} style={{ left: `${pct(c.start.year)}%`, width: `${Math.max(0.6, pct(c.end.year) - pct(c.start.year))}%` }} />
    </div>
  );

  const rows: [string, (c: Civilization) => string][] = [
    ["political", (c) => civProfiles[c.slug] ? tr(civProfiles[c.slug].political, lang) : "—"],
    ["economy", (c) => civProfiles[c.slug] ? tr(civProfiles[c.slug].economy, lang) : "—"],
    ["culture", (c) => civProfiles[c.slug] ? tr(civProfiles[c.slug].culture, lang) : "—"],
    ["rulers", (c) => civProfiles[c.slug] ? civProfiles[c.slug].rulers.map((r) => tr(r, lang)).join(", ") : "—"],
    ["achievements", (c) => civProfiles[c.slug] ? tr(civProfiles[c.slug].achievements, lang) : "—"],
    ["decline", (c) => civProfiles[c.slug] ? tr(civProfiles[c.slug].decline, lang) : "—"],
  ];

  return (
    <>
      <PageHeader eyebrow={t("nav.civilizations")} title={t("compare.title")} lead={t("compare.lead")} back={{ to: "/civilizations", label: t("nav.civilizations") }} />
      <div className="container-page pb-24">
        <div className="mb-12 grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
          {(["a", "b"] as const).map((k, i) => (
            <label key={k} className={`flex flex-col gap-2 ${i === 1 ? "md:order-3" : ""}`}>
              <span className="text-[11px] uppercase tracking-caps text-mute">{t(`compare.${k}`)}</span>
              <select value={(k === "a" ? a : b).slug} onChange={(e) => set(k, e.target.value)} className={`${selectCls} font-serif text-xl`}>
                {civilizations.filter((c) => c.slug !== (k === "a" ? b : a).slug).map((c) => <option key={c.slug} value={c.slug}>{tr(c.name, lang)}</option>)}
              </select>
            </label>
          ))}
          <button onClick={() => setParams({ a: b.slug, b: a.slug }, { replace: true })} aria-label={t("compare.swap")} className="justify-self-center border hairline p-3 hover:border-gold hover:text-gold md:order-2"><ArrowLeftRight className="h-4 w-4" /></button>
        </div>

        <section className="mb-14">
          <h2 className="eyebrow mb-4">{t("compare.period")}</h2>
          <div className="space-y-3 border hairline bg-ink-2 p-5">
            <div className="flex justify-between text-sm"><span>{tr(a.name, lang)}</span><span className="text-gold">{formatRange(a.start, a.end, lang)}</span></div>
            <Bar c={a} tone="bg-ivory/80" />
            <div className="flex justify-between text-sm"><span>{tr(b.name, lang)}</span><span className="text-gold">{formatRange(b.start, b.end, lang)}</span></div>
            <Bar c={b} tone="bg-gold" />
            <div className="relative h-4 pt-2 text-[10px] text-mute">
              {[-3000, -1500, 0, 1000, 2000].map((y) => <span key={y} className="absolute -translate-x-1/2" style={{ left: `${pct(y)}%` }}>{y < 0 ? `${-y} ${lang === "uz" ? "m.a." : "BCE"}` : y}</span>)}
            </div>
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="border hairline bg-ink-2 p-5">
            <h2 className="eyebrow mb-5">{t("compare.territory")}</h2>
            {[a, b].map((c, i) => (
              <div key={c.slug} className="mb-4">
                <div className="mb-1 flex justify-between text-sm"><span>{tr(c.name, lang)}</span><span className={i ? "text-gold" : ""}>{c.peakAreaMkm2 ?? t("civsPage.unknownArea")}</span></div>
                <div className="h-3 bg-ink-3"><motion.div layout className={`h-full ${i ? "bg-gold" : "bg-ivory/80"}`} style={{ width: `${((c.peakAreaMkm2 ?? 0) / maxArea) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="border hairline bg-ink-2 p-5">
            <h2 className="eyebrow mb-5">{t("compare.influence")}</h2>
            {[{ c: a, p: pa }, { c: b, p: pb }].map(({ c, p }, i) => (
              <div key={c.slug} className="mb-4">
                <div className="mb-1 flex justify-between text-sm"><span>{tr(c.name, lang)}</span><span className={i ? "text-gold" : ""}>{p?.countries.length ?? 0}</span></div>
                <div className="h-3 bg-ink-3"><motion.div layout className={`h-full ${i ? "bg-gold" : "bg-ivory/80"}`} style={{ width: `${((p?.countries.length ?? 0) / 15) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <div className="divide-y divide-ink-line border-y hairline">
          {rows.map(([k, fn]) => (
            <div key={k} className="grid gap-4 py-6 md:grid-cols-[12rem_1fr_1fr]">
              <h3 className="text-[11px] uppercase tracking-caps text-mute">{t(`civsPage.${k}`)}</h3>
              <p className="text-sm text-ivory-dim">{fn(a)}</p>
              <p className="text-sm text-ivory-dim md:border-l md:border-gold/30 md:pl-4">{fn(b)}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-6 text-sm">
          <Link to={`/civilizations/${a.slug}`} className="text-gold link-underline">{tr(a.name, lang)} →</Link>
          <Link to={`/civilizations/${b.slug}`} className="text-gold link-underline">{tr(b.name, lang)} →</Link>
        </div>
      </div>
    </>
  );
}
