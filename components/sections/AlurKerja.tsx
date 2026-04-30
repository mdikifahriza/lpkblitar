import { getSiteSettings } from "@/lib/api/settings";
import { AlurKerjaClient } from "./AlurKerjaClient";

export async function AlurKerja() {
  const settings = await getSiteSettings();
  return <AlurKerjaClient settings={settings} />;
}


