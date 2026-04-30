"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const faqSchema = z.object({
  id: z.string().uuid().optional(),
  pertanyaan: z.string().trim().min(1, "Pertanyaan wajib diisi."),
  jawaban: z.string().trim().min(1, "Jawaban wajib diisi."),
  layanan_id: z.string().uuid().nullable().optional(),
  nomor_urut: z.number().int().min(1, "Nomor urut minimal 1."),
  aktif: z.boolean(),
});

export async function upsertFaq(payload: unknown) {
  try {
    const data = faqSchema.parse(payload);
    const supabase = await createClient();

    const faqData = {
      pertanyaan: data.pertanyaan,
      jawaban: data.jawaban,
      layanan_id: data.layanan_id ?? null,
      nomor_urut: data.nomor_urut,
      aktif: data.aktif,
    };

    if (data.id) {
      const { error } = await supabase.from("faqs").update(faqData).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("faqs").insert([faqData]);
      if (error) throw error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("FAQ upsert error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Data FAQ tidak valid." };
    }

    return { error: error instanceof Error ? error.message : "Gagal menyimpan FAQ." };
  }
}

export async function deleteFaq(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("FAQ delete error:", error);
    return { error: error instanceof Error ? error.message : "Gagal menghapus FAQ." };
  }
}

export async function deleteAllFaqs() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("faqs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("FAQ delete all error:", error);
    return { error: error instanceof Error ? error.message : "Gagal menghapus semua FAQ." };
  }
}

export async function toggleFaqStatus(id: string, aktif: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("faqs").update({ aktif }).eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("FAQ toggle error:", error);
    return { error: error instanceof Error ? error.message : "Gagal mengubah status FAQ." };
  }
}
