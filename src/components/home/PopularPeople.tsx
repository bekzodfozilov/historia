import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { people } from "@/data/people";
import { formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { Section } from "@/components/ui/Section";

/** Portrait slot: monogram until a licensed portrait is attached in the CMS. */
const initials = (s: string) => s.split(/\s|-/).filter((w) => /^[A-ZÀ-ÿ]/.test(w)).slice(0, 2).map((w) => w[0]).join("");

export function PopularPeople() {
  const { t, lang } = useLang();
  return (
    <Section eyebrow={t("sections.people.eyebrow")} title={t("sections.people.title")} action={{ to: "/people", label: t("sections.people.all") }}>
      <ol className="divide-y divide-ink-line border-y hairline">
        {people.map((p, i) => (
          <motion.li key={p.slug} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={`/people/${p.slug}`} className="group grid grid-cols-[3rem_1fr] items-center gap-5 py-6 md:grid-cols-[4rem_5rem_1.2fr_1fr_10rem] md:gap-8">
              <span className="hidden font-serif text-2xl text-mute md:block">{String(i + 1).padStart(2, "0")}</span>
              <span className="grid aspect-square w-12 place-items-center border border-gold/40 font-serif text-xl text-gold transition-colors group-hover:bg-gold group-hover:text-ink md:w-16 md:text-2xl">
                {initials(p.name.en)}
              </span>
              <span>
                <span className="block font-serif text-2xl transition-colors group-hover:text-gold md:text-3xl">{tr(p.name, lang)}</span>
                <span className="text-sm text-mute md:hidden">{tr(p.role, lang)}</span>
              </span>
              <span className="hidden text-sm text-ivory-dim md:block">{tr(p.summary, lang)}</span>
              <span className="hidden text-right text-xs text-gold md:block">{formatDate(p.born, lang)} — {formatDate(p.died, lang)}</span>
            </Link>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
