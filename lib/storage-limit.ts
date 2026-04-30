import { createAdminClient } from "@/lib/supabase/admin";
import { getStorageBucketName } from "@/lib/storage";

export const MAX_STORAGE_BYTES = 900 * 1024 * 1024; // 900 MB

export async function getBucketSize(adminClient: any, bucketName: string, path = ''): Promise<number> {
  let totalBytes = 0;
  const { data, error } = await adminClient.storage.from(bucketName).list(path, {
    limit: 10000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error || !data) {
    return 0;
  }

  for (const item of data) {
    // If id is null, it's a folder
    if (item.id === null) {
      const folderPath = path ? `${path}/${item.name}` : item.name;
      totalBytes += await getBucketSize(adminClient, bucketName, folderPath);
    } else {
      totalBytes += item.metadata?.size || 0;
    }
  }

  return totalBytes;
}

export async function checkStorageLimit(additionalBytes = 0): Promise<{ allowed: boolean; currentBytes: number; maxBytes: number; error?: string }> {
  try {
    const adminClient = createAdminClient();
    const bucketName = getStorageBucketName();
    
    let totalBytes = await getBucketSize(adminClient, bucketName);
    
    const futureBytes = totalBytes + additionalBytes;
    
    return {
      allowed: futureBytes <= MAX_STORAGE_BYTES,
      currentBytes: totalBytes,
      maxBytes: MAX_STORAGE_BYTES,
      error: futureBytes > MAX_STORAGE_BYTES ? "Kapasitas penyimpanan telah melampaui batas (Maks 900 MB)." : undefined
    };
  } catch (error) {
    console.error("Error checking storage limit:", error);
    return { allowed: true, currentBytes: 0, maxBytes: MAX_STORAGE_BYTES };
  }
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}