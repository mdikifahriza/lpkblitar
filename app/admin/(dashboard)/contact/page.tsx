import { getContactData, getSocialPlatformOptions } from "@/lib/api/contact";
import { ContactClient } from "./ContactClient";

export default async function AdminContactPage() {
  const [{ contact, socialLinks }, platformOptions] = await Promise.all([
    getContactData({ includeInactiveSocialLinks: true }),
    getSocialPlatformOptions(),
  ]);

  return (
    <ContactClient
      initialContact={contact}
      initialSocialLinks={socialLinks}
      platformOptions={platformOptions}
    />
  );
}
