import { getSiteSettings } from "@/lib/api/settings";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  const settings = await getSiteSettings();
  return <FooterClient settings={settings} />;
}
