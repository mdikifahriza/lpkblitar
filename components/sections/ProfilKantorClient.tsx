"use client";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfilKantorClientProps {
  settings: Record<string, string>;
}

export function ProfilKantorClient({ settings }: ProfilKantorClientProps) {
  const features = [
    "Analisa Dokumen Mendalam (Deep Legal Analysis)",
    "Penyelesaian Sengketa Efektif Tanpa Sidang Panjang",
    "Tim Multi-Divisi (Litigasi, Negosiasi, Investigasi)",
    "Pengalaman di Bidang Finance & Perlindungan Konsumen",
    "Jaringan Strategis & Legal Pressure Kuat",
  ];

  return (
    <section id="profil" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-6 block">
              Tentang Kami
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold leading-tight mb-8">
              Pusat Penyelesaian Sengketa Bisnis & Konsumen
            </h2>
            <div className="prose prose-lg prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed mb-10 max-w-none">
              <p>
                Berada di Blitar, Jawa Timur, {settings.site_name || "Kantor Konsultan Hukum Hari Mulana Hutabarat"} 
                hadir sebagai solusi terpadu untuk penyelesaian sengketa finance,
                gugatan perdata, mediasi bisnis, hingga analisa aset jaminan.
              </p>
              <p>
                Filosofi kami sangat jelas:{" "}
                <strong className="text-primary font-serif italic text-xl">
                  tidak semua perkara harus berujung sidang panjang, biaya besar,
                  dan energi habis.
                </strong>{" "}
                Melalui pengalaman, jaringan, legal pressure, serta negosiasi yang
                kuat, banyak perkara justru dapat selesai secara efektif dan
                menguntungkan.
              </p>
              <p>
                Prinsip kerja kami: Cepat dianalisa, tepat ditekan, singkat
                diselesaikan.
              </p>
            </div>
            
            <Link href="/tim" passHref>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 uppercase tracking-wider font-bold rounded-none group/btn transition-colors"
              >
                Kenali Tim Kami
                <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 bg-card border border-border p-10 md:p-14"
          >
            <h3 className="font-serif text-3xl text-foreground font-bold mb-10 pb-6 border-b border-border">
              Keunggulan Penanganan Kami
            </h3>
            <ul className="space-y-8">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-5">
                  <div className="bg-primary/10 p-2 border border-primary/30 rounded-sm shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground text-lg leading-relaxed pt-1 font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

