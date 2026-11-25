import { Link } from "react-router-dom";
import { GitCompare } from "lucide-react";
import { civilizations } from "@/data/civilizations";
import { formatRange, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader } from "@/components/shared/Page";
import { Tag } from "@/components/ui/Section";

export default function CivilizationsPage() {
  const { t, lang } = useLang();
  const list = [...civilizations].sort((a, b) => a.start.year - b.start.year);
  return (
    <>
      <PageHeader eyebrow={t("nav.civilizations")} title={t("civsPage.title")} lead={t("civsPage.lead")}>
        <Link to="/compare" className="mt-8 inline-flex items-center gap-2 border border-gold px-4 py-2 text-sm text-gold hover:bg-gold hover:text-ink"><GitCompare className="h-4 w-4" />{t("civsPage.compare")}</Link>
      </PageHeader>
      <div className="container-page pb-24">
        <ul className="grid gap-px bg-ink-line md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.slug}>
              <Link to={`/civilizations/${c.slug}`} className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden bg-ink p-7 transition-colors hover:bg-ink-2">
                <span className="pointer-events-none absolute -right-4 -top-6 select-none font-serif text-[9rem] leading-none text-gold/10 transition-transform duration-700 group-hover:scale-110">{c.glyph}</span>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-gold">{formatRange(c.start, c.end, lang)}</span>
                  {c.disputed && <Tag tone="warn">{t("sections.civs.disputed")}</Tag>}
                </div>
                <div className="relative">
                  <h2 className="font-serif text-3xl leading-tight group-hover:text-gold">{tr(c.name, lang)}</h2>
                  <p className="mt-1 text-sm text-mute">{tr(c.region, lang)}</p>
                  <p className="mt-4 line-clamp-3 text-sm text-ivory-dim">{tr(c.summary, lang)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
