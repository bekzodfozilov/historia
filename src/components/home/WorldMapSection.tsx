import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { geoEqualEarth, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { Section } from "@/components/ui/Section";

type Props = { name: string };

/**
 * Lightweight SVG preview of the atlas (Natural Earth 1:110m, public domain).
 * The full interactive atlas (stage 3) uses MapLibre GL with historical border layers.
 */
export function WorldMapSection() {
  const { t } = useLang();
  const [hover, setHover] = useState<string | null>(null);
  const { paths, grat } = useMemo(() => {
    const topo = world as unknown as Topology<{ countries: GeometryCollection<Props> }>;
    const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, Props>;
    const proj = geoEqualEarth().fitSize([960, 470], fc);
    const path = geoPath(proj);
    return {
      paths: fc.features.filter((f) => f.properties.name !== "Antarctica").map((f, i) => ({ id: `${f.id ?? i}`, name: f.properties.name, d: path(f) ?? "" })),
      grat: path(geoGraticule10()) ?? "",
    };
  }, []);

  return (
    <Section eyebrow={t("sections.map.eyebrow")} title={t("sections.map.title")} lead={t("sections.map.lead")} className="bg-ink-2">
      <div className="relative border hairline bg-ink">
        <svg viewBox="0 0 960 470" className="w-full" role="img" aria-label={t("sections.map.title")}>
          <path d={grat} fill="none" stroke="#C5A46D" strokeOpacity="0.07" />
          {paths.map((p) => (
            <path key={p.id} d={p.d} onMouseEnter={() => setHover(p.name)} onMouseLeave={() => setHover(null)}
              className="cursor-pointer transition-colors duration-200"
              fill={hover === p.name ? "#C5A46D" : "#25282B"} stroke="#111315" strokeWidth="0.5" />
          ))}
        </svg>
        <div className="pointer-events-none absolute left-5 top-5 border hairline bg-ink/90 px-4 py-3">
          <p className="text-[10px] uppercase tracking-caps text-mute">{t("sections.map.hover")}</p>
          <p className="mt-1 min-h-[1.75rem] font-serif text-2xl text-gold">{hover ?? "—"}</p>
        </div>
        <Link to="/explore" className="group absolute bottom-5 right-5 inline-flex items-center gap-2 bg-gold px-5 py-3 text-sm font-medium text-ink hover:bg-gold-soft">
          {t("sections.map.open")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}
