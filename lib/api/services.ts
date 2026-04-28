import { createClient } from "@/lib/supabase/server";
import { SERVICES } from "@/lib/data";

export async function getServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("aktif", true)
    .order("nomor_urut", { ascending: true });

  if (error) {
    console.warn("⚠️ Using fallback data because Supabase services table is missing or errored:", error.message);
    return SERVICES.map((s, idx) => ({
      id: s.id,
      nama: s.title,
      slug: s.id,
      kategori: s.category.toLowerCase().replace(" ", "-"),
      deskripsi_singkat: s.description,
      deskripsi_lengkap: (s as any).detailDescription || s.description,
      nomor_urut: idx + 1
    }));
  }

  return data || [];
}

export async function getServiceBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("aktif", true)
    .single();

  if (error) {
    const s = SERVICES.find(x => x.id === slug);
    if (s) {
      return {
        id: s.id,
        nama: s.title,
        slug: s.id,
        kategori: s.category.toLowerCase().replace(" ", "-"),
        deskripsi_singkat: s.description,
        deskripsi_lengkap: (s as any).detailDescription || s.description,
      };
    }
    return null;
  }

  return data;
}

