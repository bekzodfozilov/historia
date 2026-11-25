import { SUPPORTED } from "@/i18n";
import { useLang } from "@/lib/useLang";

export function LanguageSwitcher() {
  const { lang, i18n } = useLang();
  return (
    <div role="group" aria-label="Language" className="flex border hairline text-[11px] tracking-[0.18em]">
      {SUPPORTED.map((l) => (
        <button
          key={l.code} type="button" title={l.name} aria-pressed={lang === l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`px-2.5 py-1.5 transition-colors ${lang === l.code ? "bg-gold text-ink" : "text-mute hover:text-ivory"}`}
        >{l.label}</button>
      ))}
    </div>
  );
}
