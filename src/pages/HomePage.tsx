import { Hero } from "@/components/home/Hero";
import { FeaturedTimeline } from "@/components/home/FeaturedTimeline";
import { FeaturedCivilizations } from "@/components/home/FeaturedCivilizations";
import { PopularPeople } from "@/components/home/PopularPeople";
import { OnThisDay } from "@/components/home/OnThisDay";
import { WorldMapSection } from "@/components/home/WorldMapSection";
import { RecentlyAdded } from "@/components/home/RecentlyAdded";

import { useEffect } from "react";
import { useLang } from "@/lib/useLang";

export default function HomePage() {
  const { t } = useLang();
  useEffect(() => { document.title = `HISTORIA — ${t("hero.title")}`; }, [t]);
  return (
    <>
      <Hero />
      <FeaturedTimeline />
      <FeaturedCivilizations />
      <WorldMapSection />
      <PopularPeople />
      <OnThisDay />
      <RecentlyAdded />
    </>
  );
}
