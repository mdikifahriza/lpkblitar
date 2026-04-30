"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function resetAnalytics() {
  try {
    const adminClient = createAdminClient();
    
    // Clear page_visits
    const { error: visitError } = await adminClient.from("page_visits").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (visitError && visitError.code !== "42P01" && visitError.code !== "PGRST205") {
      throw visitError;
    }
    
    // Clear inquiries
    const { error: inqError } = await adminClient.from("inquiries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (inqError && inqError.code !== "42P01" && inqError.code !== "PGRST205") {
      throw inqError;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Reset analytics error:", error);
    return { error: error instanceof Error ? error.message : "Gagal mereset data analitik." };
  }
}