import { getSiteSettings } from "@/lib/api/settings";
import { KonsultasiClient } from "./KonsultasiClient";

export default async function KonsultasiPage() {
  const settings = await getSiteSettings();
  return <KonsultasiClient settings={settings} />;
}
