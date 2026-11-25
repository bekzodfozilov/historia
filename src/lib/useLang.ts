import { useTranslation } from "react-i18next";
import type { Lang } from "@/data/types";

export function useLang() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage === "uz" ? "uz" : "en") as Lang;
  return { t, lang, i18n };
}
