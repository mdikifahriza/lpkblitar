"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LayananProps {
  services: any[];
}

export function Layanan({ services }: LayananProps) {
  return (
    <section id="layanan" className="py-24 bg-[#00365A] text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-white/60 uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
              Bidang Layanan Kami
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
              Penyelesaian Hukum Efektif & Profesional
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Link href="/layanan" passHref>
              <Button style={{ backgroundColor: '#FFDB43', color: '#00365A', border: 'none' }} className="hover:opacity-90 px-8 py-6 uppercase tracking-wider font-bold text-sm transition-opacity rounded-sm shadow-sm">
                Lihat Semua Layanan
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-[#002B47] border border-white/10 p-8 md:p-10 transition-colors duration-300 hover:border-white/30 cursor-pointer rounded-sm"
            >
              <Link href={`/layanan/${service.slug}`} className="flex flex-col h-full">
                <span className="font-serif text-2xl text-white/50 mb-6 group-hover:text-white/80 transition-colors">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                
                <h3 className="font-serif text-2xl md:text-3xl text-white font-bold mb-4">
                  {service.nama}
                </h3>
                
                <p className="text-white/70 leading-relaxed mb-10 flex-grow text-sm">
                  {service.deskripsi_singkat}
                </p>

                <div className="flex items-center gap-3 mt-auto">
                  <span className="text-white font-medium uppercase tracking-wider text-xs">Pelajari Lebih Lanjut</span>
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-[#002B47]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



