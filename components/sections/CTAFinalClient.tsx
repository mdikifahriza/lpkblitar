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

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-secondary-foreground font-bold leading-tight mb-6"
          >
            Siap Menyelesaikan <br className="hidden md:block" />
            Masalah Hukum Anda?
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-secondary-foreground/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
          >
            Jangan tunda hingga masalah semakin rumit. Dapatkan analisa tajam dan strategi penyelesaian efektif dari
            tim profesional kami.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base uppercase tracking-wider font-medium gap-3 rounded-none"
              >
                <MessageCircle className="w-5 h-5" />
                {settings.hero_cta_primary || "Hubungi via WhatsApp"}
              </Button>
            </a>

            <Link href="/konsultasi" passHref className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary/35 text-secondary-foreground hover:bg-primary/10 px-8 py-6 text-base uppercase tracking-wider font-medium gap-3 rounded-none bg-transparent"
              >
                <FileText className="w-5 h-5" />
                Isi Form Konsultasi
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
