import { createClient } from "@/lib/supabase/server";
import { TEAM, PRINCIPAL } from "@/lib/data";

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("aktif", true)
    .order("nomor_urut", { ascending: true });

  if (error) {
    console.warn("⚠️ Using fallback data because Supabase team_members table is missing or errored:", error.message);
    const allTeam = [PRINCIPAL, ...TEAM];
    return allTeam.map((m, i) => ({
      id: (m as any).id || `team-${i}`,
      nama: m.name,
      jabatan: (m as any).role || (m as any).position,
      spesialisasi: (m as any).specialty || (m as any).expertise?.join(", ") || "",
      bio: m.bio,
      foto_url: m.image,
      is_pimpinan: (m as any).id === "principal",
      nomor_urut: i + 1,
      kategori_divisi: (m as any).division || ""
    }));
  }

  return data || [];
}

