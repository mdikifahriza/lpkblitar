import { SERVICES, type Service } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export type ServiceRow = {
  id: string;
  nama: string;
  slug: string;
  kategori: string;
  deskripsi_singkat: string;
  deskripsi_lengkap: string;
  nomor_urut?: number | null;
  aktif?: boolean | null;
};

function toKebabCase(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function mapFallbackService(service: Service, index = 0): ServiceRow {
  return {
    id: service.id,
    nama: service.title,
    slug: service.slug,
    kategori: toKebabCase(service.category),
    deskripsi_singkat: service.description,
    deskripsi_lengkap: service.detail.longDescription.join("\n\n"),
    nomor_urut: index + 1,
    aktif: true,
  };
}

function findFallbackServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}

export async function getServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("aktif", true)
    .order("nomor_urut", { ascending: true });

  if (error) {
    console.warn("Using fallback service data because Supabase services query failed:", error.message);
    return SERVICES.map((service, index) => mapFallbackService(service, index));
  }

  return (data as ServiceRow[]) || [];
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("aktif", true)
    .maybeSingle();

  if (error) {
    console.warn("Using fallback service detail because Supabase service detail query failed:", error.message);
  }

  if (data) {
    return data as ServiceRow;
  }

  const fallbackService = findFallbackServiceBySlug(slug);

  if (!fallbackService) {
    return null;
  }

  return mapFallbackService(fallbackService);
}
