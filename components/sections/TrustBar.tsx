import { getSiteSettings } from "@/lib/api/settings";
import { TrustBarClient } from "./TrustBarClient";

export async function TrustBar() {
  const settings = await getSiteSettings();
  return <TrustBarClient settings={settings} />;
}


