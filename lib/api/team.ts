import { TEAM, PRINCIPAL } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export type TeamMemberRecord = {
  id: string;
  slug: string;
  nama: string;
  jabatan: string;
  spesialisasi: string;
  bio?: string | null;
  foto_url: string;
  is_pimpinan?: boolean;
  nomor_urut?: number;
  kategori_divisi?: string | null;
  aktif?: boolean;
};

function slugifyTeamName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeBio(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .join("\n\n");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function normalizeSpesialisasi(value: Record<string, unknown>) {
  if (typeof value.spesialisasi === "string" && value.spesialisasi.trim()) {
    return value.spesialisasi;
  }

  if (typeof value.specialization === "string" && value.specialization.trim()) {
    return value.specialization;
  }

  if (typeof value.specialty === "string" && value.specialty.trim()) {
    return value.specialty;
  }

  if (Array.isArray(value.expertise)) {
    return value.expertise.map((item) => String(item || "").trim()).filter(Boolean).join(", ");
  }

  if (Array.isArray(value.skills)) {
    return value.skills.map((item) => String(item || "").trim()).filter(Boolean).join(", ");
  }

  return "";
}

function normalizeTeamMember(
  raw: Record<string, unknown>,
  index: number,
  options: { forceLeader?: boolean } = {}
): TeamMemberRecord {
  const nama =
    (typeof raw.nama === "string" && raw.nama.trim()) ||
    (typeof raw.name === "string" && raw.name.trim()) ||
    `Anggota Tim ${index + 1}`;

  const baseSlug =
    (typeof raw.slug === "string" && raw.slug.trim()) ||
    slugifyTeamName(nama) ||
    `anggota-tim-${index + 1}`;

  const id = (typeof raw.id === "string" && raw.id.trim()) || baseSlug || `team-${index + 1}`;

  return {
    id,
    slug: baseSlug,
    nama,
    jabatan:
      (typeof raw.jabatan === "string" && raw.jabatan.trim()) ||
      (typeof raw.role === "string" && raw.role.trim()) ||
      (typeof raw.position === "string" && raw.position.trim()) ||
      "Tim Hukum",
    spesialisasi: normalizeSpesialisasi(raw),
    bio: normalizeBio(raw.bio),
    foto_url:
      (typeof raw.foto_url === "string" && raw.foto_url.trim()) ||
      (typeof raw.image === "string" && raw.image.trim()) ||
      "/fallback-gambar.jpeg",
    is_pimpinan:
      typeof raw.is_pimpinan === "boolean"
        ? raw.is_pimpinan
        : options.forceLeader || (typeof raw.id === "string" && raw.id === "principal"),
    nomor_urut: typeof raw.nomor_urut === "number" ? raw.nomor_urut : index + 1,
    kategori_divisi:
      (typeof raw.kategori_divisi === "string" && raw.kategori_divisi.trim()) ||
      (typeof raw.division === "string" && raw.division.trim()) ||
      "",
    aktif: typeof raw.aktif === "boolean" ? raw.aktif : true,
  };
}

function ensureUniqueSlugs(team: TeamMemberRecord[]) {
  const slugCounter = new Map<string, number>();

  return team.map((member) => {
    const count = slugCounter.get(member.slug) || 0;
    slugCounter.set(member.slug, count + 1);

    if (count === 0) {
      return member;
    }

    return {
      ...member,
      slug: `${member.slug}-${count + 1}`,
    };
  });
}

export async function getTeamMembers(): Promise<TeamMemberRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("aktif", true)
    .order("nomor_urut", { ascending: true });

  if (error) {
    console.warn(
      "⚠️ Using fallback data because Supabase team_members table is missing or errored:",
      error.message
    );
    const allTeam = [PRINCIPAL, ...TEAM];
    return ensureUniqueSlugs(
      allTeam.map((member, index) =>
        normalizeTeamMember(member as Record<string, unknown>, index, { forceLeader: index === 0 })
      )
    );
  }

  return ensureUniqueSlugs(
    ((data || []) as Array<Record<string, unknown>>).map((member, index) =>
      normalizeTeamMember(member, index)
    )
  );
}

export async function getTeamMemberBySlug(slug: string) {
  const team = await getTeamMembers();
  return team.find((member) => member.slug === slug) || null;
}
