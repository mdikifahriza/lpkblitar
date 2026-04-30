export function getStorageBucketName() {
  return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets";
}

export function getStoragePathFromUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  const bucket = getStorageBucketName();
  const urlParts = url.split(`/${bucket}/`);

  return urlParts.length > 1 ? urlParts[1] : null;
}
