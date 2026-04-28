import { getSiteSettings } from "@/lib/api/settings";
import { CTAFinalClient } from "./CTAFinalClient";

export async function CTAFinal() {
  const settings = await getSiteSettings();
  return <CTAFinalClient settings={settings} />;
}
