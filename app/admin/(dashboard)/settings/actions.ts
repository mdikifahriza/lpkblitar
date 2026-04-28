"use server";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteSettings(formData: any) {
  try {
    const supabase = await createClient();
    
    // Check if site_settings table exists
    const { error: checkError } = await supabase.from('site_settings').select('id').limit(1);
    
    if (checkError) {
      console.warn("⚠️ Supabase site_settings table missing or errored:", checkError.message);
      return { error: "Tabel pengaturan tidak ditemukan di database." };
    }

    // Iterate through the formData and update each row
    const promises = Object.entries(formData).map(async ([key, value]) => {
      // First try to update using 'key'
      const { error: err1 } = await supabase
        .from('site_settings')
        .update({ value: value })
        .eq('key', key);
        
      if (err1 && err1.code === '42703') {
        // Fallback to 'setting_key' and 'setting_value' (DK Showroom schema)
        await supabase
          .from('site_settings')
          .update({ setting_value: value })
          .eq('setting_key', key);
      }
    });

    await Promise.all(promises);

    return { success: true };
  } catch (error) {
    console.error("Settings update error:", error);
    return { error: "Terjadi kesalahan server saat menyimpan pengaturan." };
  }
}
