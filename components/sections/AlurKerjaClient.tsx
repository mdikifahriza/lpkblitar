"use client";
import { motion } from "framer-motion";

export function AlurKerjaClient({ settings }: { settings: any }) {
  const WORKFLOW = [
    {
      title: "Konsultasi Awal",
      description: "Mendengarkan kronologi secara menyeluruh dan mengumpulkan bukti-bukti permulaan."
    },
    {
      title: "Analisa Dokumen",
      description: "Membedah setiap pasal dan klausula secara detail untuk menemukan celah hukum."
    },
    {
      title: "Strategi Hukum",
      description: "Menentukan langkah paling efektif, baik melalui litigasi, mediasi, maupun laporan."
    },
    {
      title: "Penyelesaian",
      description: "Mengeksekusi strategi yang telah disusun untuk mengembalikan hak klien."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-background border-y border-border">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            Bagaimana Kami Bekerja
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight">
            Alur Penanganan Perkara
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-[#ffffff10] z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {WORKFLOW.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative"
              >
                {/* Number Circle */}
                <div className="w-24 h-24 mx-auto lg:mx-0 rounded-full bg-card border border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_15px_hsl(var(--primary)/0.15)]">
                  <span className="font-serif text-4xl font-bold text-primary">
                    0{idx + 1}
                  </span>
                </div>

                <div className="text-center lg:text-left">
                  <h3 className="font-serif text-2xl text-foreground font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

