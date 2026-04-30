"use server";

import { createClient } from "@supabase/supabase-js";
import { checkStorageLimit } from "@/lib/storage-limit";

type UploadResult =
  | { success: true; url: string }
  | { error: string };

function isAllowedIcoMimeType(type: string) {
  return type === "" || type === "image/x-icon" || type === "image/vnd.microsoft.icon";
}

export async function uploadFileToSupabase(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;
    const assetKey = formData.get("assetKey") as string | null;

    if (!file || !path) {
      return { error: "File atau path tidak valid" };
    }
    
    // Check storage limits before uploading
    const storageCheck = await checkStorageLimit(file.size);
    if (!storageCheck.allowed) {
      return { error: storageCheck.error || "Kapasitas penyimpanan penuh." };
    }

    if (assetKey === "favicon_url") {
      const lowerFileName = file.name.toLowerCase();
      const lowerPath = path.toLowerCase();

      if (!lowerFileName.endsWith(".ico") || !lowerPath.endsWith(".ico")) {
        return { error: "Favicon hanya menerima file .ico" };
      }

      if (!isAllowedIcoMimeType(file.type)) {
        return { error: "Format favicon harus ICO yang valid" };
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!;

    if (!supabaseServiceKey) {
      return { error: "Service Role Key tidak dikonfigurasi di .env" };
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets";

    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.find((bucketItem) => bucketItem.name === bucket)) {
      await supabaseAdmin.storage.createBucket(bucket, { public: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
      contentType: assetKey === "favicon_url" ? "image/x-icon" : file.type,
      upsert: true,
    });

    if (error) {
      console.error("Storage upload error:", error);
      return { error: error.message };
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return { success: true, url: urlData.publicUrl };
  } catch (error: unknown) {
    console.error("Upload execution error:", error);
    return {
      error: error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah.",
    };
  }
}
