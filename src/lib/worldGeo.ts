import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";
import { byCcn3, type Country } from "@/data/countries";

export interface GeoCountry { key: string; name: string; country?: Country; feature: FeatureCollection<Geometry, { name: string }>["features"][number] }

let cache: GeoCountry[] | null = null;
/** Natural Earth 1:110m (public domain) joined to the country dataset via ISO numeric code. */
export function worldFeatures(): GeoCountry[] {
  if (cache) return cache;
  const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
  cache = fc.features
    .filter((f) => f.properties.name !== "Antarctica")
    .map((f, i) => ({ key: `${f.id ?? "x" + i}`, name: f.properties.name, country: f.id ? byCcn3.get(String(Number(f.id))) : undefined, feature: f }));
  return cache;
}
