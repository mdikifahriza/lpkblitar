"use client";

import Link from "next/link";
import { FileText, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { ContactSettingsRecord } from "@/lib/api/contact";
import { buildWhatsAppUrl } from "@/lib/contact";
import { Button } from "@/components/ui/button";

interface CTAFinalClientProps {
  settings: Record<string, string>;
  contact: ContactSettingsRecord;
}

export function CTAFinalClient({ settings, contact }: CTAFinalClientProps) {
  const whatsappUrl = buildWhatsAppUrl(
    contact.whatsapp_number,
    contact.whatsapp_message_default
  );

  return (
    <section className="relative py-24 bg-secondary text-secondary-foreground overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            {settings.hero_heading || "Analisa Tajam. Tim Kuat. Sengketa Tuntas."}
          </h2>
          <p className="text-secondary-foreground/80 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Jangan tunda penyelesaian masalah hukum Anda. Diskusikan bersama tim kami hari ini untuk menemukan strategi penyelesaian yang paling tepat dan efisien.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base uppercase tracking-wider font-medium gap-3 rounded-none"
              >
                <MessageCircle className="w-5 h-5" />
                {settings.hero_cta_primary || "Hubungi via WhatsApp"}
              </Button>
            </a>
            <Link href="/konsultasi" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary/35 text-secondary-foreground hover:bg-primary/10 px-8 py-6 text-base uppercase tracking-wider font-medium gap-3 rounded-none bg-transparent"
              >
                <FileText className="w-5 h-5" />
                Isi Form Konsultasi
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
