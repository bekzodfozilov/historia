import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLang } from "@/lib/useLang";

export const NAV = [
  { key: "explore", to: "/explore" },
  { key: "countries", to: "/countries" },
  { key: "timeline", to: "/timeline" },
  { key: "civilizations", to: "/civilizations" },
  { key: "people", to: "/people" },
  { key: "events", to: "/events" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="HISTORIA home">
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-gold" aria-hidden>
        <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M9 9v14M23 9v14M9 16h14" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
      <span className="font-serif text-xl tracking-[0.32em]">HISTORIA</span>
    </Link>
  );
}

export function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? "border-b hairline bg-ink/95 backdrop-blur" : "bg-transparent"}`}>
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-8 text-[13px]">
            {NAV.map((n) => (
              <li key={n.key}>
                <NavLink to={n.to} className={({ isActive }) => `link-underline pb-1 transition-colors ${isActive ? "text-gold" : "text-ivory-dim hover:text-ivory"}`}>
                  {t(`nav.${n.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button className="p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={t(open ? "nav.close" : "nav.menu")}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden lg:hidden" aria-label="Mobile">
            <ul className="container-page pb-8 pt-2">
              {NAV.map((n, i) => (
                <motion.li key={n.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="border-b hairline">
                  <NavLink to={n.to} className="block py-4 font-serif text-3xl">{t(`nav.${n.key}`)}</NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
