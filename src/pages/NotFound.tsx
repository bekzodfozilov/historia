import { Link } from "react-router-dom";
import { useLang } from "@/lib/useLang";
import { PageHeader } from "@/components/shared/Page";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="min-h-[70vh]">
      <PageHeader eyebrow="404" title={t("notFound.title")} lead={t("notFound.body")} />
      <div className="container-page"><Link to="/" className="text-gold link-underline">{t("common.back")}</Link></div>
    </div>
  );
}
