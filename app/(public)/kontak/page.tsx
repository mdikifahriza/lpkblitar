import { getContactData } from "@/lib/api/contact";
import { getSiteSettings } from "@/lib/api/settings";
import { buildStaticPageMetadata } from "@/lib/page-seo";
import { KontakClient } from "./KontakClient";

export async function generateMetadata() {
  return buildStaticPageMetadata({
    path: "/kontak",
    fallbackTitle: "Kontak",
    fallbackDescription:
      "Hubungi Hutabarat Law untuk konsultasi hukum, informasi alamat kantor, jam operasional, dan akses WhatsApp resmi.",
  });
}

export default async function KontakPage() {
  const [settings, { contact, socialLinks }] = await Promise.all([
    getSiteSettings(),
    getContactData(),
  ]);

  return <KontakClient settings={settings} contact={contact} socialLinks={socialLinks} />;
}
