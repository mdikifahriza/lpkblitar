import { createClient } from "@/lib/supabase/server";

export type ContactSettingsRecord = {
  id: string | null;
  whatsapp_number: string;
  whatsapp_message_default: string;
  email: string;
  alamat: string;
  jam_operasional: string;
  maps_embed_url: string;
  maps_link_url: string;
  source: "contact_settings" | "site_settings";
  tablesReady: boolean;
};

export type ContactSocialLink = {
  id: string;
  contact_settings_id: string | null;
  platform_id: string | null;
  platform_code: string;
  platform_nama: string;
  icon_key: string;
  url: string;
  nomor_urut: number;
  aktif: boolean;
};

export type SocialPlatformOption = {
  id: string;
  code: string;
  nama: string;
  icon_key: string;
  placeholder_url: string;
  nomor_urut: number;
  aktif: boolean;
};

const DEFAULT_CONTACT_SETTINGS: Omit<ContactSettingsRecord, "id" | "source" | "tablesReady"> = {
  whatsapp_number: "6281234567890",
  whatsapp_message_default: "Halo Pak Hari, saya ingin konsultasi mengenai masalah hukum saya.",
  email: "info@hutabaratlawoffice.com",
  alamat: "Jalan Menur RT 003 / RW 007, Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, Jawa Timur",
  jam_operasional: "Senin - Jumat: 08.00 - 17.00 WIB",
  maps_embed_url: "https://maps.google.com/maps?q=Blitar&output=embed",
  maps_link_url: "",
};

const FALLBACK_SOCIAL_PLATFORMS: SocialPlatformOption[] = [
  {
    id: "instagram",
    code: "instagram",
    nama: "Instagram",
    icon_key: "instagram",
    placeholder_url: "https://instagram.com/namaakun",
    nomor_urut: 1,
    aktif: true,
  },
  {
    id: "facebook",
    code: "facebook",
    nama: "Facebook",
    icon_key: "facebook",
    placeholder_url: "https://facebook.com/namahalaman",
    nomor_urut: 2,
    aktif: true,
  },
  {
    id: "x",
    code: "x",
    nama: "X",
    icon_key: "x",
    placeholder_url: "https://x.com/namaakun",
    nomor_urut: 3,
    aktif: true,
  },
  {
    id: "youtube",
    code: "youtube",
    nama: "YouTube",
    icon_key: "youtube",
    placeholder_url: "https://youtube.com/@namachannel",
    nomor_urut: 4,
    aktif: true,
  },
  {
    id: "linkedin",
    code: "linkedin",
    nama: "LinkedIn",
    icon_key: "linkedin",
    placeholder_url: "https://linkedin.com/company/namaperusahaan",
    nomor_urut: 5,
    aktif: true,
  },
  {
    id: "tiktok",
    code: "tiktok",
    nama: "TikTok",
    icon_key: "tiktok",
    placeholder_url: "https://tiktok.com/@namaakun",
    nomor_urut: 6,
    aktif: true,
  },
  {
    id: "threads",
    code: "threads",
    nama: "Threads",
    icon_key: "threads",
    placeholder_url: "https://threads.net/@namaakun",
    nomor_urut: 7,
    aktif: true,
  },
  {
    id: "telegram",
    code: "telegram",
    nama: "Telegram",
    icon_key: "telegram",
    placeholder_url: "https://t.me/namaakun",
    nomor_urut: 8,
    aktif: true,
  },
];

const LEGACY_SOCIAL_KEYS = [
  { key: "instagram_url", code: "instagram", nama: "Instagram", icon_key: "instagram", nomor_urut: 1 },
  { key: "facebook_url", code: "facebook", nama: "Facebook", icon_key: "facebook", nomor_urut: 2 },
  { key: "x_url", code: "x", nama: "X", icon_key: "x", nomor_urut: 3 },
  { key: "youtube_url", code: "youtube", nama: "YouTube", icon_key: "youtube", nomor_urut: 4 },
  { key: "linkedin_url", code: "linkedin", nama: "LinkedIn", icon_key: "linkedin", nomor_urut: 5 },
  { key: "tiktok_url", code: "tiktok", nama: "TikTok", icon_key: "tiktok", nomor_urut: 6 },
  { key: "threads_url", code: "threads", nama: "Threads", icon_key: "threads", nomor_urut: 7 },
  { key: "telegram_url", code: "telegram", nama: "Telegram", icon_key: "telegram", nomor_urut: 8 },
] as const;

async function getLegacySiteSettingsMap() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("key, value");

  if (error) {
    return {};
  }

  return (data ?? []).reduce<Record<string, string>>((accumulator, item) => {
    if (item.key) {
      accumulator[item.key] = item.value ?? "";
    }
    return accumulator;
  }, {});
}

function mapLegacyContact(settings: Record<string, string>, tablesReady: boolean): ContactSettingsRecord {
  return {
    id: null,
    whatsapp_number:
      settings.whatsapp_number || settings.organization_phone || DEFAULT_CONTACT_SETTINGS.whatsapp_number,
    whatsapp_message_default:
      settings.whatsapp_message_default || DEFAULT_CONTACT_SETTINGS.whatsapp_message_default,
    email: settings.email || DEFAULT_CONTACT_SETTINGS.email,
    alamat: settings.alamat || DEFAULT_CONTACT_SETTINGS.alamat,
    jam_operasional: settings.jam_operasional || DEFAULT_CONTACT_SETTINGS.jam_operasional,
    maps_embed_url: settings.maps_embed_url || DEFAULT_CONTACT_SETTINGS.maps_embed_url,
    maps_link_url: settings.maps_link_url || "",
    source: "site_settings",
    tablesReady,
  };
}

function mapLegacySocialLinks(settings: Record<string, string>, includeInactive: boolean) {
  return LEGACY_SOCIAL_KEYS.reduce<ContactSocialLink[]>((accumulator, socialKey) => {
    const url = settings[socialKey.key]?.trim();

    if (!url) {
      return accumulator;
    }

    accumulator.push({
      id: `legacy-${socialKey.code}-${accumulator.length + 1}`,
      contact_settings_id: null,
      platform_id: null,
      platform_code: socialKey.code,
      platform_nama: socialKey.nama,
      icon_key: socialKey.icon_key,
      url,
      nomor_urut: socialKey.nomor_urut,
      aktif: true,
    });

    return accumulator;
  }, []).filter((item) => includeInactive || item.aktif);
}

export async function getSocialPlatformOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_platforms")
    .select("*")
    .order("nomor_urut", { ascending: true });

  if (error || !data?.length) {
    return FALLBACK_SOCIAL_PLATFORMS;
  }

  return data.map((item) => ({
    id: item.id,
    code: item.code,
    nama: item.nama,
    icon_key: item.icon_key,
    placeholder_url: item.placeholder_url ?? "",
    nomor_urut: item.nomor_urut ?? 0,
    aktif: Boolean(item.aktif),
  })) satisfies SocialPlatformOption[];
}

export async function getContactData({
  includeInactiveSocialLinks = false,
}: {
  includeInactiveSocialLinks?: boolean;
} = {}) {
  const supabase = await createClient();
  const legacySettings = await getLegacySiteSettingsMap();
  const legacyContact = mapLegacyContact(legacySettings, false);
  const legacySocialLinks = mapLegacySocialLinks(legacySettings, includeInactiveSocialLinks);

  const { data: contactRow, error: contactError } = await supabase
    .from("contact_settings")
    .select("*")
    .eq("singleton_key", "main")
    .maybeSingle();

  if (contactError) {
    return {
      contact: legacyContact,
      socialLinks: legacySocialLinks,
    };
  }

  const mappedContact: ContactSettingsRecord = contactRow
    ? {
        id: contactRow.id,
        whatsapp_number: contactRow.whatsapp_number || legacyContact.whatsapp_number,
        whatsapp_message_default:
          contactRow.whatsapp_message_default || legacyContact.whatsapp_message_default,
        email: contactRow.email || legacyContact.email,
        alamat: contactRow.alamat || legacyContact.alamat,
        jam_operasional: contactRow.jam_operasional || legacyContact.jam_operasional,
        maps_embed_url: contactRow.maps_embed_url || legacyContact.maps_embed_url,
        maps_link_url: contactRow.maps_link_url || legacyContact.maps_link_url,
        source: "contact_settings",
        tablesReady: true,
      }
    : {
        ...legacyContact,
        tablesReady: true,
      };

  if (!contactRow?.id) {
    return {
      contact: mappedContact,
      socialLinks: legacySocialLinks,
    };
  }

  const { data: socialData, error: socialError } = await supabase
    .from("contact_social_links_view")
    .select("*")
    .eq("contact_settings_id", contactRow.id)
    .order("nomor_urut", { ascending: true })
    .order("created_at", { ascending: true });

  if (socialError) {
    return {
      contact: mappedContact,
      socialLinks: legacySocialLinks,
    };
  }

  const socialLinks = (socialData ?? [])
    .filter((item) => includeInactiveSocialLinks || Boolean(item.aktif))
    .map((item) => ({
      id: item.id,
      contact_settings_id: item.contact_settings_id ?? contactRow.id,
      platform_id: item.platform_id ?? null,
      platform_code: item.platform_code,
      platform_nama: item.platform_nama,
      icon_key: item.icon_key,
      url: item.url,
      nomor_urut: item.nomor_urut ?? 0,
      aktif: Boolean(item.aktif),
    })) satisfies ContactSocialLink[];

  return {
    contact: mappedContact,
    socialLinks,
  };
}
