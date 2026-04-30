"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getStorageBucketName, getStoragePathFromUrl } from "@/lib/storage";

type TeamMemberPayload = {
  id?: string | null;
  foto_url?: string | null;
  previous_foto_url?: string | null;
  [key: string]: unknown;
};

export async function upsertTeamMember(data: TeamMemberPayload) {
  try {
    const supabase = await createClient();
    const { previous_foto_url, ...payload } = data;

    if (payload.id) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", payload.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("team_members").insert([payload]);
      if (error) throw error;
    }

    if (
      typeof previous_foto_url === "string" &&
      typeof payload.foto_url === "string" &&
      previous_foto_url &&
      previous_foto_url !== payload.foto_url
    ) {
      const previousPath = getStoragePathFromUrl(previous_foto_url);

      if (previousPath) {
        const adminClient = createAdminClient();
        await adminClient.storage.from(getStorageBucketName()).remove([previousPath]);
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Team upsert error:", error);
    return { error: error instanceof Error ? error.message : "Gagal menyimpan anggota tim." };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();
    const { data: existingMember } = await adminClient
      .from("team_members")
      .select("foto_url")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) throw error;

    if (existingMember?.foto_url) {
      const filePath = getStoragePathFromUrl(existingMember.foto_url);

      if (filePath) {
        await adminClient.storage.from(getStorageBucketName()).remove([filePath]);
      }
    }

    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus anggota." };
  }
}

export async function toggleTeamStatus(id: string, aktif: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("team_members").update({ aktif }).eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Gagal mengubah status." };
  }
}
