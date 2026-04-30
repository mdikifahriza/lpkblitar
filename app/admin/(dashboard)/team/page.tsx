import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { TeamClient } from "./TeamClient";

export default async function AdminTeamPage() {
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

  const { data: team, error } = await supabase
    .from("team_members")
    .select("*")
    .order("nomor_urut", { ascending: true });

  let data = team || [];
  
  if (error && error.code === 'PGRST205') {
     data = [
       { id: "1", nama: "Dummy Lawyer", jabatan: "Lawyer", spesialisasi: "Sengketa", foto_url: "", aktif: true, nomor_urut: 1 }
     ];
  }

  return <TeamClient initialTeam={data} />;
}


