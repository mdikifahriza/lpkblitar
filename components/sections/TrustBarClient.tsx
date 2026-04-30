"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Scale, Users, MapPin } from "lucide-react";

interface TrustBarClientProps {
  settings: Record<string, string>;
}

export function TrustBarClient({ settings }: TrustBarClientProps) {
  const trustMetrics = [
    {
      icon: ShieldCheck,
      value: "10+",
      label: "Tahun Pengalaman",
      sublabel: "Penyelesaian Sengketa"
    },
    {
      icon: Scale,
      value: "8",
      label: "Bidang Layanan",
      sublabel: "Fokus Hukum Bisnis"
    },
    {
      icon: Users,
      value: "4",
      label: "Divisi Tim",
      sublabel: "Profesional Terlatih"
    },
    {
      icon: MapPin,
      value: "Blitar",
      label: "Wilayah Utama",
      sublabel: "& Sekitarnya"
    }
  ];

  return (
    <section className="bg-card border-y border-border py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {trustMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center pt-8 md:pt-0 px-4 group"
            >
              <metric.icon className="w-8 h-8 text-primary mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-2">
                {metric.value}
              </h3>
              <p className="text-foreground text-sm uppercase tracking-wider font-medium mb-1">
                {metric.label}
              </p>
              <p className="text-muted-foreground text-xs">
                {metric.sublabel}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



