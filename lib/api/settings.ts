import { createClient } from "@/lib/supabase/server";

export type SiteSettingsMap = Record<string, string> & {
  site_name: string;
  site_tagline: string;
  site_description: string;
  tab_title: string;
  tab_title_template: string;
  logo_url: string;
  logo_dark_url: string;
  hero_heading: string;
  hero_subheading: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_image_url: string;
  hero_badge: string;
  og_image_default_url: string;
  favicon_url: string;
  google_verification: string;
  whatsapp_number: string;
  email: string;
  alamat: string;
  jam_operasional: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  organization_street_address: string;
  organization_city: string;
  organization_region: string;
};

export type PageSeoRecord = {
  id: string;
  halaman: string;
  title: string | null;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  schema_json: string | null;
  no_index: boolean | null;
  updated_at: string | null;
};

const DEFAULT_SETTINGS: SiteSettingsMap = {
  site_name: "Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA",
  site_tagline: "Analisa Tajam. Tim Kuat. Sengketa Tuntas.",
  site_description:
    "Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha.",
  tab_title: "Hutabarat Law - Konsultan Hukum & Perlindungan Konsumen Blitar",
  tab_title_template: "%s | Hutabarat Law",
  logo_url: "",
  logo_dark_url: "",
  hero_heading: "Analisa Tajam. Tim Kuat. Sengketa Tuntas.",
  hero_subheading:
    "Kantor konsultan hukum dan perlindungan konsumen di Blitar yang berfokus pada penyelesaian sengketa finance, perbankan, dan pengembangan usaha secara efektif.",
  hero_cta_primary: "Konsultasi via WhatsApp",
  hero_cta_secondary: "Lihat Layanan",
  hero_image_url: "/images/hero-portrait.png",
  hero_badge: "Konsultan Hukum & Perlindungan Konsumen",
  og_image_default_url: "/images/hero-portrait.png",
  favicon_url: "/favicon.ico",
  google_verification: "",
  whatsapp_number: "6281234567890",
  email: "info@hutabaratlawoffice.com",
  alamat: "Jalan Menur RT 003 / RW 007, Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, Jawa Timur",
  jam_operasional: "Senin - Jumat: 08.00 - 17.00 WIB",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  organization_name: "",
  organization_email: "",
  organization_phone: "",
  organization_street_address: "",
  organization_city: "",
  organization_region: "",
};

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    console.warn(
      "Using fallback data because Supabase site_settings table is missing or errored:",
      error.message
    );
    return DEFAULT_SETTINGS;
  }

  const mapped = data.reduce<SiteSettingsMap>((accumulator, current) => {
    const key = current.key || current.setting_key;
    const value = current.value || current.setting_value;

    if (key) {
      accumulator[key] = value ?? "";
    }

    return accumulator;
  }, { ...DEFAULT_SETTINGS });

  if (!mapped.email && mapped.organization_email) {
    mapped.email = mapped.organization_email;
  }

  if (!mapped.whatsapp_number && mapped.organization_phone) {
    mapped.whatsapp_number = mapped.organization_phone;
  }

  if (!mapped.alamat && mapped.organization_street_address) {
    mapped.alamat = `${mapped.organization_street_address}, ${mapped.organization_city}, ${mapped.organization_region}`;
  }

  if (!mapped.site_name && mapped.organization_name) {
    mapped.site_name = mapped.organization_name;
  }

  return mapped;
}

export async function getPageSeo(path: string): Promise<PageSeoRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_seo")
    .select("*")
    .eq("halaman", path)
    .maybeSingle();

  if (error) {
    return null;
  }

  return (data as PageSeoRecord | null) || null;
}
