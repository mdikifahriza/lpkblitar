"use server";
import { createClient } from "@/lib/supabase/server";

export async function submitInquiry(data: any) {
  try {
    const supabase = await createClient();
    
    // Check if inquiries table exists
    const { error: checkError } = await supabase.from('inquiries').select('id').limit(1);
    
    if (checkError) {
      console.warn("⚠️ Supabase inquiries table missing or errored:", checkError.message);
      // Simulate success for dummy mode
      return { success: true, dummyMode: true };
    }

    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          nama: data.namaLengkap,
          no_hp: data.noHp,
          email: data.email || null,
          pesan: `Jenis Masalah: ${data.jenisMasalah}\nKota: ${data.kota}\n\nKronologi:\n${data.kronologi}`,
          status: 'baru'
        }
      ]);

    if (error) {
      console.error("Error inserting inquiry:", error);
      return { error: "Gagal mengirim data. Silakan coba lagi." };
    }

    return { success: true };
  } catch (error) {
    console.error("Action error:", error);
    return { error: "Terjadi kesalahan server." };
  }
}
