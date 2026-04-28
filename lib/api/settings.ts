import { createClient } from "@/lib/supabase/server";

const DEFAULT_SETTINGS = {
  site_name: "Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA",
  site_tagline: "Analisa Tajam. Tim Kuat. Sengketa Tuntas.",
  site_description: "Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha.",
  tab_title: "Hutabarat Law — Konsultan Hukum & Perlindungan Konsumen Blitar",
  logo_url: "",
  hero_heading: "Analisa Tajam. Tim Kuat. Sengketa Tuntas.",
  hero_subheading: "Kantor konsultan hukum dan perlindungan konsumen di Blitar yang berfokus pada penyelesaian sengketa finance, perbankan, dan pengembangan usaha secara efektif.",
  hero_cta_primary: "Konsultasi via WhatsApp",
  hero_cta_secondary: "Lihat Layanan",
  hero_image_url: "/images/hero-portrait.png",
  hero_badge: "Konsultan Hukum & Perlindungan Konsumen",
  whatsapp_number: "6281234567890",
  phone_number: "(0342) 123456",
  email: "info@hutabaratlawoffice.com",
  alamat: "Jalan Menur RT 003 / RW 007, Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, Jawa Timur",
  jam_operasional: "Senin - Jumat: 08.00 - 17.00 WIB"
};

export async function getSiteSettings() {
  const supabase = await createClient();
  // Supabase might have 'key' or 'setting_key' depending on if the user applied the exact SQL or re-used DK Showroom
  // Let's try selecting everything
  const { data, error } = await supabase
    .from("site_settings")
    .select("*");

  if (error) {
    console.warn("⚠️ Using fallback data because Supabase site_settings table is missing or errored:", error.message);
    return DEFAULT_SETTINGS;
  }

  return data.reduce((acc: Record<string, string>, curr) => {
    // handle both 'key' (from our schema) and 'setting_key' (from DK showroom)
    const k = curr.key || curr.setting_key;
    const v = curr.value || curr.setting_value;
    if (k) acc[k] = v;
    return acc;
  }, { ...DEFAULT_SETTINGS });
}

export async function getPageSeo(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_seo")
    .select("*")
    .eq("halaman", path)
    .single();

  if (error) {
    return null;
  }

  return data || null;
}
