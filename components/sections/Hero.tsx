import { getSiteSettings } from "@/lib/api/settings";
import { HeroClient } from "./HeroClient";

export async function Hero() {
  const settings = await getSiteSettings();
  return <HeroClient settings={settings} />;
}
