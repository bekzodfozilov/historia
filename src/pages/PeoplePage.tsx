import { useState } from "react";
import { Link } from "react-router-dom";
import { people } from "@/data/people";
import type { Person } from "@/data/types";
import { formatDate, tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { PageHeader, Chip, Empty, inputCls } from "@/components/shared/Page";

const CATS: Person["category"][] = ["rulers", "military", "scientists", "philosophers", "explorers", "political", "artists", "religious"];
export const initials = (s: string) => s.split(/\s|-/).filter((w) => /^[A-ZÀ-ÿ]/.test(w)).slice(0, 2).map((w) => w[0]).join("");

export default function PeoplePage() {
  const { t, lang } = useLang();
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const list = people
    .filter((p) => (cat === "all" || p.category === cat) && (!q || `${p.name.en} ${p.name.uz}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => a.born.year - b.born.year);
  return (
    <>
      <PageHeader eyebrow={t("nav.people")} title={t("peoplePage.title")} lead={t("peoplePage.lead")} />
      <div className="container-page pb-24">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("peoplePage.search")} aria-label={t("peoplePage.search")} className={`${inputCls} mb-4 max-w-md`} />
        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>{t("peoplePage.all")}</Chip>
          {CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{t(`cats.${c}`)} ({people.filter((p) => p.category === c).length})</Chip>)}
        </div>
        {list.length === 0 ? <Empty text={t("peoplePage.empty")} action={{ label: t("countries.reset"), onClick: () => { setCat("all"); setQ(""); } }} /> : (
          <ul className="grid gap-px bg-ink-line sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.slug}>
                <Link to={`/people/${p.slug}`} className="group flex h-full gap-5 bg-ink p-6 transition-colors hover:bg-ink-2">
                  <span className="grid h-16 w-16 shrink-0 place-items-center border border-gold/40 font-serif text-2xl text-gold group-hover:bg-gold group-hover:text-ink">{initials(p.name.en)}</span>
                  <span>
                    <span className="text-[10px] uppercase tracking-caps text-mute">{t(`cats.${p.category}`)}</span>
                    <span className="block font-serif text-2xl leading-tight group-hover:text-gold">{tr(p.name, lang)}</span>
                    <span className="mt-1 block text-xs text-gold">{formatDate(p.born, lang)} — {formatDate(p.died, lang)}</span>
                    <span className="mt-3 block text-sm text-mute">{tr(p.role, lang)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
