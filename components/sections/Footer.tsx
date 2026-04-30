import { getContactData } from "@/lib/api/contact";
import { getSiteSettings } from "@/lib/api/settings";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  const [settings, { contact, socialLinks }] = await Promise.all([
    getSiteSettings(),
    getContactData(),
  ]);

  return <FooterClient settings={settings} contact={contact} socialLinks={socialLinks} />;
}
