"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { FilterChipRail } from "@/components/ui/filter-chip-rail";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  type ServiceCategory,
} from "@/lib/data";

type FilterValue = "Semua" | ServiceCategory;

function getServiceMobileLabel(category: FilterValue) {
  switch (category) {
    case "Perlindungan Konsumen":
      return "Konsumen";
    case "Konsultasi Usaha":
      return "Usaha";
    default:
      return category;
  }
}

export default function LayananClient() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("Semua");

  const filteredServices = useMemo(() => {
    if (activeFilter === "Semua") return SERVICES;
    return SERVICES.filter((service) => service.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-background pb-14 pt-32 md:pb-20 md:pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary opacity-[0.06] blur-[120px]" />

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground md:mb-8"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-foreground">Layanan</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-4xl font-bold leading-[1.02] text-foreground md:text-5xl lg:text-6xl">
              Bidang Layanan Hukum
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 md:mb-20"
          >
            <FilterChipRail
              options={SERVICE_CATEGORIES.map((category) => ({
                value: category,
                label: category,
                mobileLabel: getServiceMobileLabel(category),
              }))}
              activeValue={activeFilter}
              onChange={(value) => setActiveFilter(value as FilterValue)}
              buttonClassName="md:px-5 md:py-2.5 md:text-base md:font-medium md:tracking-normal"
              desktopClassName="md:gap-3"
              inactiveButtonClassName="md:bg-transparent md:text-foreground md:hover:text-primary"
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
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
                    <div className="group relative h-full cursor-pointer overflow-hidden rounded-sm border border-border bg-card p-10 transition-all duration-300 hover:border-primary md:p-14">
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-8 flex items-start justify-between">
                          <span className="font-serif text-3xl leading-none text-primary md:text-4xl">
                            {service.id}
                          </span>
                          <span className="rounded-full border border-[#ffffff15] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {service.category}
                          </span>
                        </div>
                        <h3 className="mb-5 font-serif text-2xl leading-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
                          {service.title}
                        </h3>
                        <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary">
                            Selengkapnya
                          </span>
                          <ArrowRight className="h-6 w-6 text-primary opacity-50 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 transition-all duration-500 group-hover:from-primary/5 group-hover:to-primary/5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredServices.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              Belum ada layanan dalam kategori ini.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
