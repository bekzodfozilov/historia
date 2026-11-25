import { Link } from "react-router-dom";
import { Logo, NAV } from "./Header";
import { useLang } from "@/lib/useLang";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t hairline bg-ink-2">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ivory-dim">{t("footer.tagline")}</p>
        </div>
        <ul className="grid grid-cols-2 gap-3 text-sm md:col-span-3">
          {NAV.map((n) => (
            <li key={n.key}><Link to={n.to} className="link-underline text-mute hover:text-ivory">{t(`nav.${n.key}`)}</Link></li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed text-mute md:col-span-4">{t("footer.sourcing")}</p>
      </div>
      <div className="container-page flex justify-between border-t hairline py-6 text-[11px] uppercase tracking-caps text-mute">
        <span>© {new Date().getFullYear()} {t("footer.rights")}</span>
        <span>EN · UZ</span>
      </div>
    </footer>
  );
}
