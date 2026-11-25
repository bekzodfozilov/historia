import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { useLang } from "@/lib/useLang";

/**
 * Cinematic hero. The background is an engraved-style celestial chart drawn in SVG
 * (a nod to Ulugh Beg's star catalogue) so the page ships with zero unlicensed imagery.
 * Swap `HeroArt` for licensed museum photography via the CMS `images` table.
 */
function HeroArt() {
  const rings = [120, 200, 290, 390, 500];
  const stars = Array.from({ length: 90 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180, r = 60 + ((i * 53) % 520);
    return { x: 600 + Math.cos(a) * r, y: 420 + Math.sin(a) * r * 0.62, s: (i % 7) / 4 + 0.4 };
  });
  return (
    <motion.svg viewBox="0 0 1200 840" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-gold" aria-hidden
      >
      <g fill="none" stroke="currentColor" strokeOpacity="0.16">
        {rings.map((r) => <ellipse key={r} cx="600" cy="420" rx={r} ry={r * 0.62} />)}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          return <line key={i} x1="600" y1="420" x2={600 + Math.cos(a) * 640} y2={420 + Math.sin(a) * 400} strokeOpacity="0.06" />;
        })}
      </g>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 400, repeat: Infinity, ease: "linear" }} style={{ originX: "600px", originY: "420px" }}>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="currentColor" fillOpacity={0.25 + (i % 5) * 0.1} />)}
      </motion.g>
    </motion.svg>
  );
}

export function Hero() {
  const { t } = useLang();
  const stats = [
    { v: "5,000+", k: "years" }, { v: "195", k: "countries" }, { v: "2", k: "langs" },
  ];
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden pt-[72px]">
      <HeroArt />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#111315_75%)]" />
      <div className="container-page relative z-10 w-full py-20">
        <p className="rise eyebrow mb-8" style={{ animationDelay: ".2s" }}>{t("hero.eyebrow")}</p>
        <h1 className="rise display max-w-5xl text-[clamp(3rem,8.5vw,8rem)]" style={{ animationDelay: ".35s" }}>{t("hero.title")}</h1>
        <p className="rise mt-8 max-w-xl text-lg text-ivory-dim" style={{ animationDelay: ".7s" }}>{t("hero.lead")}</p>
        <div className="rise relative z-20 mt-10" style={{ animationDelay: ".9s" }}><SearchBar /></div>
        <dl className="rise mt-16 flex flex-wrap gap-x-14 gap-y-6" style={{ animationDelay: "1.1s" }}>
          {stats.map((s) => (
            <div key={s.k} className="border-l border-gold/40 pl-4">
              <dt className="font-serif text-4xl text-ivory">{s.v}</dt>
              <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-mute">{t(`hero.stats.${s.k}`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
