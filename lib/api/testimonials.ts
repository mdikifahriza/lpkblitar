import { createClient } from "@/lib/supabase/server";
import { TESTIMONIALS } from "@/lib/data";

export async function getTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(`
      *,
      services (
        nama
      )
    `)
    .eq("ditampilkan", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("⚠️ Using fallback data because Supabase testimonials table is missing or errored:", error.message);
    return TESTIMONIALS.map((t: any, i) => ({
      id: `testi-${i}`,
      nama_klien: t.author || t.client,
      isi: t.quote,
      services: { nama: t.service }
    }));
  }

  return data || [];
}
