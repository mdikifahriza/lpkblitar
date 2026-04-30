"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface LayananProps {
  services: any[];
}

export function Layanan({ services }: LayananProps) {
  return (
    <section id="layanan" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
              Area Keahlian
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight">
              Bidang Layanan Kami
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-card border border-border p-8 md:p-10 transition-colors duration-300 hover:border-primary cursor-pointer rounded-sm"
            >
              <Link href={`/layanan/${service.slug}`} className="flex flex-col h-full">
                <span className="font-serif text-2xl text-primary mb-6">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl text-foreground mb-4 group-hover:text-primary transition-colors">
                  {service.nama}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-12">
                  {service.deskripsi_singkat}
                </p>
                <div className="mt-auto self-end">
                  <ArrowRight className="text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 w-6 h-6" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



