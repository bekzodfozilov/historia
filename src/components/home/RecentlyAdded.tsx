import { Link } from "react-router-dom";
import { recentlyAdded, timelineEvents } from "@/data/events";
import { civilizations } from "@/data/civilizations";
import { people } from "@/data/people";
import { tr } from "@/lib/format";
import { useLang } from "@/lib/useLang";
import { Section, Tag } from "@/components/ui/Section";

const lookup = { civilizations, people, events: timelineEvents } as const;

export function RecentlyAdded() {
  const { t, lang } = useLang();
  return (
    <Section eyebrow={t("sections.recent.eyebrow")} title={t("sections.recent.title")}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {recentlyAdded.map((r) => {
          const item = (lookup[r.kind] as readonly { slug: string; name?: { en: string; uz: string }; title?: { en: string; uz: string }; summary: { en: string; uz: string } }[]).find((x) => x.slug === r.slug);
          if (!item) return null;
          return (
            <Link key={r.slug} to={`/${r.kind}/${r.slug}`} className="group border-t border-gold/40 pt-5">
              <div className="mb-4 flex items-center justify-between">
                <Tag>{t(`kinds.${r.kind}`)}</Tag>
                <time className="text-[11px] text-mute" dateTime={r.added}>{t("sections.recent.added")} {new Date(r.added).toLocaleDateString(lang === "uz" ? "uz-UZ" : "en-GB")}</time>
              </div>
              <h3 className="font-serif text-2xl group-hover:text-gold">{tr((item.name ?? item.title)!, lang)}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-mute">{tr(item.summary, lang)}</p>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
