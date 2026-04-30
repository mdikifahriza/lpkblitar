"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { buildGoogleMapsEmbedUrl } from "@/lib/google-maps";
import { createClient } from "@/lib/supabase/server";

const contactSettingsSchema = z.object({
  whatsapp_number: z.string().trim().min(1, "Nomor WhatsApp wajib diisi."),
  whatsapp_message_default: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Email tidak valid.").optional().or(z.literal("")),
  alamat: z.string().trim().optional().or(z.literal("")),
  jam_operasional: z.string().trim().optional().or(z.literal("")),
  maps_embed_url: z.string().trim().optional().or(z.literal("")),
  maps_link_url: z.string().trim().optional().or(z.literal("")),
});

const socialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  platform_id: z.string().uuid("Platform media sosial tidak valid."),
  url: z.string().trim().url("URL media sosial tidak valid."),
  nomor_urut: z.number().int().min(1, "Nomor urut minimal 1."),
  aktif: z.boolean(),
});

function revalidateContactPages() {
  revalidatePath("/", "layout");
  revalidatePath("/kontak");
  revalidatePath("/konsultasi");
  revalidatePath("/admin/contact");
}

function isMissingRelationError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || error.message?.toLowerCase().includes("does not exist") || false;
}

async function upsertLegacySiteSettings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  values: z.infer<typeof contactSettingsSchema>
) {
  const generatedMapsEmbedUrl = values.maps_link_url
    ? await buildGoogleMapsEmbedUrl(values.maps_link_url)
    : values.maps_embed_url ?? "";

  const rows = [
    ["whatsapp_number", values.whatsapp_number, "Nomor WhatsApp"],
    ["whatsapp_message_default", values.whatsapp_message_default ?? "", "Pesan Default WhatsApp"],
    ["email", values.email ?? "", "Email Kantor"],
    ["alamat", values.alamat ?? "", "Alamat Lengkap"],
    ["jam_operasional", values.jam_operasional ?? "", "Jam Operasional"],
    ["maps_embed_url", generatedMapsEmbedUrl, "URL Embed Google Maps"],
    ["maps_link_url", values.maps_link_url ?? "", "Link Google Maps"],
  ].map(([key, value, label]) => ({
    key,
    value,
    tipe: "text",
    label,
  }));

  const { error } = await supabase.from("site_settings").upsert(rows, {
    onConflict: "key",
  });

  if (error) {
    throw error;
  }
}

async function ensureMainContactId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: existing, error } = await supabase
    .from("contact_settings")
    .select("id")
    .eq("singleton_key", "main")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing?.id) {
    return existing.id;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("contact_settings")
    .insert([{ singleton_key: "main" }])
    .select("id")
    .single();

  if (insertError) {
    throw insertError;
  }

  return inserted.id;
}

export async function upsertContactSettings(payload: unknown) {
  try {
    const values = contactSettingsSchema.parse(payload);
    const supabase = await createClient();
    const generatedMapsEmbedUrl = values.maps_link_url
      ? await buildGoogleMapsEmbedUrl(values.maps_link_url)
      : values.maps_embed_url ?? "";

    const { data: existing, error: existingError } = await supabase
      .from("contact_settings")
      .select("id")
      .eq("singleton_key", "main")
      .maybeSingle();

    if (isMissingRelationError(existingError)) {
      await upsertLegacySiteSettings(supabase, values);
      revalidateContactPages();
      return { success: true };
    }

    if (existingError) {
      throw existingError;
    }

    const contactPayload = {
      singleton_key: "main",
      whatsapp_number: values.whatsapp_number,
      whatsapp_message_default: values.whatsapp_message_default ?? "",
      email: values.email ?? "",
      alamat: values.alamat ?? "",
      jam_operasional: values.jam_operasional ?? "",
      maps_embed_url: generatedMapsEmbedUrl,
      maps_link_url: values.maps_link_url ?? "",
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("contact_settings")
        .update(contactPayload)
        .eq("id", existing.id);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("contact_settings").insert([contactPayload]);

      if (error) {
        throw error;
      }
    }

    revalidateContactPages();
    return { success: true };
  } catch (error: unknown) {
    console.error("Contact settings upsert error:", error);

    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Data kontak tidak valid." };
    }

    return {
      error: error instanceof Error ? error.message : "Gagal menyimpan data kontak.",
    };
  }
}

export async function upsertContactSocialLink(payload: unknown) {
  try {
    const values = socialLinkSchema.parse(payload);
    const supabase = await createClient();
    const contactSettingsId = await ensureMainContactId(supabase);

    const socialPayload = {
      contact_settings_id: contactSettingsId,
      platform_id: values.platform_id,
      url: values.url,
      nomor_urut: values.nomor_urut,
      aktif: values.aktif,
    };

    if (values.id) {
      const { error } = await supabase
        .from("contact_social_links")
        .update(socialPayload)
        .eq("id", values.id);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("contact_social_links").insert([socialPayload]);

      if (error) {
        throw error;
      }
    }

    revalidateContactPages();
    return { success: true };
  } catch (error: unknown) {
    console.error("Contact social link upsert error:", error);

    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Data media sosial tidak valid." };
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string" &&
      error.code === "42P01"
    ) {
      return { error: "Jalankan migrasi kontak terlebih dahulu untuk mengelola link media sosial." };
    }

    return {
      error: error instanceof Error ? error.message : "Gagal menyimpan link media sosial.",
    };
  }
}

export async function deleteContactSocialLink(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_social_links").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidateContactPages();
    return { success: true };
  } catch (error: unknown) {
    console.error("Contact social link delete error:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal menghapus link media sosial.",
    };
  }
}

export async function toggleContactSocialLinkStatus(id: string, aktif: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_social_links")
      .update({ aktif })
      .eq("id", id);

    if (error) {
      throw error;
    }

    revalidateContactPages();
    return { success: true };
  } catch (error: unknown) {
    console.error("Contact social link toggle error:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal mengubah status link media sosial.",
    };
  }
}
