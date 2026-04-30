"use server";
import { createClient } from "@supabase/supabase-js";

export async function getEmailByUsername(username: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!;

    if (!supabaseServiceKey) {
      console.error("Service Role Key missing");
      return { error: "Konfigurasi server tidak lengkap" };
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if profiles table exists first
    const { error: checkError } = await supabaseAdmin.from('profiles').select('id').limit(1);
    if (checkError) {
      console.warn("Profiles table might not exist yet:", checkError.message);
      return { error: "Login dengan username belum didukung (Tabel profiles belum tersedia)" };
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (error || !data) {
      return { error: "Username tidak ditemukan" };
    }

    // Now get the email from auth.users using the admin api
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(data.id);
    
    if (userError || !userData?.user) {
      return { error: "Gagal memuat data pengguna" };
    }

    return { email: userData.user.email };
  } catch (error: any) {
    return { error: "Terjadi kesalahan internal" };
  }
}
