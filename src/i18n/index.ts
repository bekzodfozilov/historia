import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import uz from "./locales/uz.json";

/** To add a language: drop a JSON file in ./locales, register it here, add it to SUPPORTED. */
export const SUPPORTED = [
  { code: "en", label: "EN", name: "English" },
  { code: "uz", label: "UZ", name: "O‘zbekcha" },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, uz: { translation: uz } },
    fallbackLng: "en",
    supportedLngs: SUPPORTED.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"], lookupLocalStorage: "historia.lang" },
  });

i18n.on("languageChanged", (l) => (document.documentElement.lang = l));
export default i18n;
