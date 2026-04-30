import { getSiteSettings } from "@/lib/api/settings";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const settings = await getSiteSettings();
  return <NavbarClient settings={settings} />;
}


