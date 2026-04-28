"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  type ServiceCategory,
} from "@/lib/data";

type FilterValue = "Semua" | ServiceCategory;

export default function LayananPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("Semua");

  const filteredServices = useMemo(() => {
    if (activeFilter === "Semua") return SERVICES;
    return SERVICES.filter((service) => service.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f5f0e8]">
      
      {/* Page Header */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-[#0d1117]">
        {/* Subtle noise texture, same as hero */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Soft gold ambient glow */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#c9a84c] opacity-[0.06] blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Breadcrumb"
            className="mb-10 flex items-center gap-2 text-sm text-[#8b8680]"
          >
            <Link
              href="/"
              className="hover:text-[#c9a84c] transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[#f5f0e8]">Layanan</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-4xl"
          >
            <span className="text-[#c9a84c] uppercase tracking-[0.2em] text-sm font-medium mb-6 block">
              Layanan Kami
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#f5f0e8] font-bold leading-[1.05] mb-8">
              Bidang Layanan Hukum
            </h1>
            <p className="text-[#8b8680] text-lg md:text-xl leading-relaxed max-w-2xl">
              Kami menyediakan pendampingan hukum menyeluruh â€” dari litigasi
              perdata hingga perlindungan konsumen â€” dengan analisa tajam dan
              strategi yang terukur untuk setiap perkara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="bg-[#0a0d12] py-20 md:py-28 border-t border-[#ffffff10]">
        <div className="container mx-auto px-4 md:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-3 mb-14 md:mb-20"
          >
            {SERVICE_CATEGORIES.map((category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-5 py-2.5 text-sm md:text-base rounded-full border transition-all duration-300 ${
                    isActive
                      ? "bg-[#c9a84c] text-[#0d1117] border-[#c9a84c] font-medium"
                      : "bg-transparent text-[#f5f0e8] border-[#ffffff20] hover:border-[#c9a84c] hover:text-[#c9a84c]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </motion.div>

          {/* Service Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            >
              {filteredServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <Link href={`/layanan/${service.slug}`}>
                    <div className="group relative bg-[#161b27] border border-[#ffffff10] p-10 md:p-14 transition-all duration-300 hover:border-[#c9a84c] cursor-pointer rounded-sm h-full overflow-hidden">
                      <div className="flex flex-col h-full relative z-10">
                        <div className="flex items-start justify-between mb-8">
                          <span className="font-serif text-3xl md:text-4xl text-[#c9a84c] leading-none">
                            {service.id}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-[#8b8680] border border-[#ffffff15] px-3 py-1 rounded-full">
                            {service.category}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl md:text-3xl text-[#f5f0e8] mb-5 group-hover:text-[#c9a84c] transition-colors leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-[#8b8680] leading-relaxed mb-12 md:text-lg">
                          {service.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm uppercase tracking-[0.2em] text-[#8b8680] group-hover:text-[#c9a84c] transition-colors">
                            Selengkapnya
                          </span>
                          <ArrowRight className="text-[#c9a84c] opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 w-6 h-6" />
                        </div>
                      </div>
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/0 via-transparent to-[#c9a84c]/0 group-hover:from-[#c9a84c]/[0.04] group-hover:to-[#c9a84c]/[0.02] transition-all duration-500 pointer-events-none" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredServices.length === 0 && (
            <div className="text-center py-20 text-[#8b8680]">
              Belum ada layanan dalam kategori ini.
            </div>
          )}
        </div>
      </section>

                      </div>
  );
}



