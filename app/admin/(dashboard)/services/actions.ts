"use server";

import { createClient } from "@/lib/supabase/server";

function normalizeServicePayload(data: Record<string, any>) {
  const payload = { ...data };

  if (!payload.slug && payload.nama) {
    payload.slug = payload.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }

  return payload;
}

export async function insertService(data: any) {
  try {
    const supabase = await createClient();
    const payload = normalizeServicePayload(data);
    const { id: _id, ...insertPayload } = payload;
    const { error } = await supabase.from("services").insert([insertPayload]);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Service insert error:", error);
    return { error: error.message || "Gagal menambahkan layanan." };
  }
}

export async function updateService(data: any) {
  try {
    const supabase = await createClient();
    const payload = normalizeServicePayload(data);

    if (!payload.id) {
      return { error: "ID layanan tidak ditemukan." };
    }

    const { id, ...updatePayload } = payload;
    const { error } = await supabase.from("services").update(updatePayload).eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Service update error:", error);
    return { error: error.message || "Gagal memperbarui layanan." };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus layanan." };
  }
}

export async function deleteAllServices() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus semua layanan." };
  }
}

export async function toggleServiceStatus(id: string, aktif: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("services").update({ aktif }).eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal mengubah status." };
  }
}
