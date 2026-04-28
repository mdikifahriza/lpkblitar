"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  nama_klien: string;
  isi: string;
  services?: { nama: string };
}

interface TestimoniProps {
  testimonials: Testimonial[];
}

export function Testimoni({ testimonials }: TestimoniProps) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            Kepercayaan Klien
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight mb-6">
            Apa Kata Klien Kami
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimoni, idx) => (
            <motion.div
              key={testimoni.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-card border border-border p-10 flex flex-col justify-between"
            >
              <div className="mb-8">
                <Quote className="text-primary w-12 h-12 mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-foreground leading-relaxed italic text-lg mb-8 relative z-10">
                  "{testimoni.isi}"
                </p>
              </div>

              <div className="mt-auto border-t border-border pt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-primary text-lg mb-1">
                    {testimoni.nama_klien}
                  </h4>
                  {testimoni.services?.nama && (
                    <span className="text-muted-foreground text-sm uppercase tracking-wider">
                      {testimoni.services.nama}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

