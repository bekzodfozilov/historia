import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLang } from "@/lib/useLang";

/** Sets document title (SEO) and renders an editorial page header. */
export function PageHeader({ eyebrow, title, lead, back, children }: { eyebrow?: string; title: string; lead?: string; back?: { to: string; label: string }; children?: ReactNode }) {
  useEffect(() => { document.title = `${title} — HISTORIA`; }, [title]);
  return (
    <header className="container-page pb-10 pt-[130px] md:pt-[150px]">
      {back && (
        <Link to={back.to} className="mb-8 inline-flex items-center gap-2 text-sm text-mute hover:text-gold">
          <ArrowLeft className="h-4 w-4" />{back.label}
        </Link>
      )}
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h1 className="display text-5xl md:text-7xl">{title}</h1>
      {lead && <p className="mt-6 max-w-2xl text-lg text-ivory-dim">{lead}</p>}
      {children}
    </header>
  );
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`whitespace-nowrap border px-3 py-1.5 text-xs transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-ink-line text-mute hover:border-mute hover:text-ivory"}`}>
      {children}
    </button>
  );
}

export function Empty({ text, action }: { text: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col items-start gap-4 border border-dashed border-ink-line p-10 text-mute">
      <p>{text}</p>
      {action && <button onClick={action.onClick} className="text-sm text-gold link-underline">{action.label}</button>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t hairline py-4">
      <dt className="text-[11px] uppercase tracking-caps text-mute">{label}</dt>
      <dd className="mt-1.5 text-ivory">{children}</dd>
    </div>
  );
}

export function Sources({ items }: { items: { title: string; publisher: string; url?: string }[] }) {
  const { t } = useLang();
  return (
    <section>
      <h2 className="eyebrow mb-4">{t("common.sources")}</h2>
      <ol className="space-y-3 border-t hairline pt-4 text-sm">
        {items.map((s, i) => (
          <li key={i} className="flex gap-3"><span className="text-mute">{i + 1}.</span>
            <span><span className="italic">{s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="link-underline">{s.title}</a> : s.title}</span><span className="block text-mute">{s.publisher}</span></span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const inputCls = "w-full border border-ink-line bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-mute focus:border-gold focus:outline-none";
export const selectCls = "border border-ink-line bg-ink-2 px-3 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none";
