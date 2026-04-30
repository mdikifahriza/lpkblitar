import { getSiteSettings } from "@/lib/api/settings";
import { ProfilKantorClient } from "./ProfilKantorClient";

export async function ProfilKantor() {
  const settings = await getSiteSettings();
  return <ProfilKantorClient settings={settings} />;
}


