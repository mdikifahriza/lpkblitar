import { getContactData } from "@/lib/api/contact";
import { getSiteSettings } from "@/lib/api/settings";
import { HeroClient } from "./HeroClient";

export async function Hero() {
  const [settings, { contact }] = await Promise.all([getSiteSettings(), getContactData()]);

  return <HeroClient settings={settings} contact={contact} />;
}
