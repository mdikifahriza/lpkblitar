import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { PageVisitTracker } from "@/components/analytics/PageVisitTracker";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { getContactData } from "@/lib/api/contact";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { contact } = await getContactData();

  return (
    <>
      <PageVisitTracker />
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <CTAFinal />
      <Footer />
      <FloatingWhatsApp
        phoneNumber={contact.whatsapp_number}
        message={contact.whatsapp_message_default}
      />
    </>
  );
}
