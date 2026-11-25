import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { civilizations } from "@/data/civilizations";
import { formatRange, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { Section, Tag } from "@/components/ui/Section";

export function FeaturedCivilizations() {
  const { t, lang } = useLang();
  const [lead, ...rest] = civilizations.filter((c) => ["timurid-empire", "roman-empire", "achaemenid-empire", "kushan-empire", "ancient-egypt"].includes(c.slug));
  return (
    <Section eyebrow={t("sections.civs.eyebrow")} title={t("sections.civs.title")} action={{ to: "/civilizations", label: t("sections.civs.all") }}>
      <div className="grid gap-px bg-ink-line md:grid-cols-2 lg:grid-cols-4">
        <motion.article initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="group relative overflow-hidden bg-ink-2 md:col-span-2 lg:row-span-2">
          <Link to={`/civilizations/${lead.slug}`} className="flex h-full min-h-[420px] flex-col justify-between overflow-hidden p-8 md:p-10">
            <span className="pointer-events-none absolute -right-6 -top-10 select-none font-serif text-[18rem] leading-none text-gold/10 transition-transform duration-700 group-hover:scale-105">{lead.glyph}</span>
            <Tag tone="gold">{formatRange(lead.start, lead.end, lang)}</Tag>
            <div className="relative">
              <h3 className="display text-5xl md:text-6xl transition-colors group-hover:text-gold">{tr(lead.name, lang)}</h3>
              <p className="mt-5 max-w-md text-ivory-dim">{tr(lead.summary, lang)}</p>
              <dl className="mt-8 flex gap-10 text-sm">
                <div><dt className="text-[11px] uppercase tracking-caps text-mute">{t("sections.civs.capital")}</dt><dd className="mt-1">{tr(lead.capital, lang)}</dd></div>
              </dl>
            </div>
          </Link>
        </motion.article>
        {rest.map((c, i) => (
          <motion.article key={c.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="group relative bg-ink-2 transition-colors hover:bg-ink-3">
            <Link to={`/civilizations/${c.slug}`} className="flex h-full min-h-[210px] flex-col justify-between p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-gold">{formatRange(c.start, c.end, lang)}</span>
                {c.disputed && <Tag tone="warn">{t("sections.civs.disputed")}</Tag>}
              </div>
              <div>
                <h3 className="font-serif text-3xl leading-tight transition-colors group-hover:text-gold">{tr(c.name, lang)}</h3>
                <p className="mt-2 text-sm text-mute">{tr(c.region, lang)}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
