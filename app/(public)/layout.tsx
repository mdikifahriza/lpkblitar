import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <CTAFinal />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
