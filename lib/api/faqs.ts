import { createClient } from "@/lib/supabase/server";
import { FAQS } from "@/lib/data";

export async function getFaqs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("aktif", true)
    .order("nomor_urut", { ascending: true });

  if (error) {
    console.warn("⚠️ Using fallback data because Supabase faqs table is missing or errored:", error.message);
    return FAQS.map((f, i) => ({
      id: `faq-${i}`,
      pertanyaan: f.question,
      jawaban: f.answer,
      nomor_urut: i + 1
    }));
  }

  return data || [];
}

export async function getFaqsByService(serviceId: string) {
  return await getFaqs();
}
