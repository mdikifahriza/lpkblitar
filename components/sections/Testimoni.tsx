"use client";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimoni, idx) => (
            <motion.div
              key={testimoni.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-card border-x border-b border-t-4 border-border border-t-primary p-8 md:p-10 flex flex-col justify-between rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute right-8 top-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
                <Quote className="w-24 h-24 text-primary rotate-180" />
              </div>
              
              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFDB43] text-[#FFDB43]" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed italic text-base md:text-lg">
                  "{testimoni.isi}"
                </p>
              </div>

              <div className="mt-auto border-t border-border/60 pt-6 flex items-center justify-between relative z-10">
                <div>
                  <h4 className="font-serif font-bold text-foreground text-lg mb-1.5">
                    {testimoni.nama_klien}
                  </h4>
                  {testimoni.services?.nama && (
                    <span className="text-primary font-medium text-xs uppercase tracking-wider block">
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



