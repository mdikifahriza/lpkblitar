"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

interface HeroClientProps {
  settings: Record<string, string>;
}

export function HeroClient({ settings }: HeroClientProps) {
  const whatsappNumber = settings.whatsapp_number || "6281234567890";
  const defaultMessage = settings.whatsapp_message_default || "Halo Pak Hari, saya ingin konsultasi mengenai masalah hukum saya.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden noise-bg">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start max-w-2xl"
          >
            <span className="text-primary uppercase tracking-[0.2em] text-xs md:text-sm font-medium mb-6 px-4 py-2 border border-primary/30 rounded-full bg-primary/5">
              {settings.hero_badge || "Konsultan Hukum & Perlindungan Konsumen"}
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground font-bold leading-[1.1] mb-8">
              {settings.hero_heading || "Analisa Tajam. Tim Kuat. Sengketa Tuntas."}
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-12 max-w-xl">
              {settings.hero_subheading || "Kantor konsultan hukum dan perlindungan konsumen di Blitar yang berfokus pada penyelesaian sengketa finance, perbankan, dan pengembangan usaha secara efektif."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base uppercase tracking-wider font-bold gap-3 rounded-sm transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
                >
                  <MessageCircle className="w-5 h-5" />
                  {settings.hero_cta_primary || "Konsultasi via WhatsApp"}
                </Button>
              </a>

              <Link href="#layanan" passHref className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border text-foreground hover:bg-muted px-8 py-6 text-base uppercase tracking-wider font-medium gap-3 rounded-sm transition-colors"
                >
                  {settings.hero_cta_secondary || "Lihat Layanan"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-[100px] -z-10" />
            <div className="relative aspect-[3/4] max-w-md ml-auto mr-12 rounded-2xl overflow-hidden border border-border shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-80" />
              <SafeImage
                src={settings.hero_image_url || "/images/hero-portrait.png"}
                alt="Hari Mulana Hutabarat"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Floating decorative element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 bg-card/80 backdrop-blur-md border border-primary/30 p-6 rounded-xl shadow-xl z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-serif text-xl font-bold">10+</span>
                </div>
                <div>
                  <p className="text-foreground font-bold text-sm uppercase tracking-wider">Tahun Pengalaman</p>
                  <p className="text-primary text-xs">Penyelesaian Sengketa</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

