"use server";
import { createClient } from "@/lib/supabase/server";

export async function updateInquiryStatus(id: string, status: string, catatan: string | null = null) {
  try {
    const supabase = await createClient();
    
    const updateData: any = { status };
    if (catatan !== null) {
      updateData.catatan_internal = catatan;
    }

    const { error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST205') {
        // Dummy Mode fallback
        return { success: true, dummyMode: true };
      }
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating inquiry:", error);
    return { error: error.message || "Gagal memperbarui status." };
  }
}

export async function deleteAllInquiries() {
  try {
    const supabase = await createClient();
    
    // Attempt delete all
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // match everything

    if (error) {
      if (error.code === 'PGRST205' || error.code === '42P01') {
        return { success: true, dummyMode: true };
      }
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting all inquiries:", error);
    return { error: error.message || "Gagal menghapus data." };
  }
}
