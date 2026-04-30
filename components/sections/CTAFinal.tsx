import { getContactData } from "@/lib/api/contact";
import { getSiteSettings } from "@/lib/api/settings";
import { CTAFinalClient } from "./CTAFinalClient";

export async function CTAFinal() {
  const [settings, { contact }] = await Promise.all([getSiteSettings(), getContactData()]);

  return <CTAFinalClient settings={settings} contact={contact} />;
}
