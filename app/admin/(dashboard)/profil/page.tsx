import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ProfilClient } from "./ProfilClient";

export default async function ProfilPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap, username, no_hp, foto_url, role")
    .eq("id", user?.id)
    .maybeSingle();

  return (
    <ProfilClient
      initialProfile={{
        id: user?.id || "",
        fullName: profile?.nama_lengkap || user?.user_metadata?.full_name || "",
        username: profile?.username || "",
        email: user?.email || "",
        phone: profile?.no_hp || "",
        role: profile?.role || "admin",
        avatarUrl: profile?.foto_url || user?.user_metadata?.avatar_url || "",
      }}
    />
  );
}


