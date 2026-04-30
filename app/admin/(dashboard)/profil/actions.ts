"use server";

import { z } from "zod";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClientSupabase } from "@/lib/supabase/server";

const updateOwnProfileSchema = z.object({
  nama_lengkap: z.string().trim().min(2, "Nama lengkap wajib diisi."),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter.")
    .regex(/^[a-z0-9._-]+$/, "Username hanya boleh berisi huruf kecil, angka, titik, garis bawah, atau strip."),
  email: z.string().trim().email("Email tidak valid."),
  no_hp: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[0-9+\-\s]+$/.test(value), {
      message: "Nomor HP hanya boleh berisi angka dan simbol umum telepon.",
    }),
  password: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 6, {
      message: "Kata sandi minimal 6 karakter.",
    }),
  foto_url: z.string().trim().optional(),
  previous_foto_url: z.string().trim().optional(),
});

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!;

  return createSupabaseAdminClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

const getStoragePathFromUrl = (url: string) => {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets";
  const urlParts = url.split(`/${bucket}/`);

  return urlParts.length > 1 ? urlParts[1] : null;
};

export async function updateOwnProfile(payload: unknown) {
  try {
    const values = updateOwnProfileSchema.parse(payload);
    const supabase = await createServerClientSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Sesi login tidak ditemukan." };
    }

    const adminClient = getAdminClient();
    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const authUpdates: {
      email: string;
      email_confirm: true;
      password?: string;
      user_metadata: {
        full_name: string;
        avatar_url: string;
      };
    } = {
      email: values.email,
      email_confirm: true,
      user_metadata: {
        full_name: values.nama_lengkap,
        avatar_url: values.foto_url || "",
      },
    };

    if (values.password) {
      authUpdates.password = values.password;
    }

    const { error: authError } = await adminClient.auth.admin.updateUserById(user.id, authUpdates);

    if (authError) {
      throw authError;
    }

    if (existingProfile) {
      const { error: profileError } = await adminClient
        .from("profiles")
        .update({
          nama_lengkap: values.nama_lengkap,
          username: values.username,
          no_hp: values.no_hp || null,
          foto_url: values.foto_url || null,
        })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }
    } else {
      const { error: profileInsertError } = await adminClient.from("profiles").insert({
        id: user.id,
        nama_lengkap: values.nama_lengkap,
        username: values.username,
        role: "admin",
        no_hp: values.no_hp || null,
        foto_url: values.foto_url || null,
      });

      if (profileInsertError) {
        throw profileInsertError;
      }
    }

    if (
      values.previous_foto_url &&
      values.foto_url &&
      values.previous_foto_url !== values.foto_url
    ) {
      const previousPath = getStoragePathFromUrl(values.previous_foto_url);

      if (previousPath) {
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets";
        await adminClient.storage.from(bucket).remove([previousPath]);
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating own profile:", error);

    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Data profil tidak valid." };
    }

    return { error: error instanceof Error ? error.message : "Gagal memperbarui profil." };
  }
}
