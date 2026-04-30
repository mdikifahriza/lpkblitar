import { checkStorageLimit, formatBytes } from "@/lib/storage-limit";
import { StorageClient } from "./StorageClient";

export default async function StoragePage() {
  const storageData = await checkStorageLimit(0);

  return <StorageClient storageData={storageData} />;
}