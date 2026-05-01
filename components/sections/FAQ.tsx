"use client";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Faq {
  id: string;
  pertanyaan: string;
  jawaban: string;
}

interface FaqProps {
  faqs: Faq[];
}

export function FAQ({ faqs }: FaqProps) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Kolom Kiri */}
          <div className="lg:w-1/3 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left max-w-sm sticky top-32"
            >
              <span className="text-primary uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
                Pertanyaan Umum
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold leading-tight mb-8">
                Bantuan Cepat
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Temukan jawaban dari pertanyaan yang sering diajukan. Jika Anda tidak menemukan jawaban yang Anda cari, silakan hubungi tim kami.
              </p>
            </motion.div>
          </div>

          {/* Kolom Kanan: Accordion */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${idx}`}
                    className="border-b border-border/80 mb-2 rounded-sm"
                  >
                    <AccordionTrigger className="text-left font-serif text-xl md:text-2xl text-foreground hover:text-primary hover:no-underline py-6 transition-colors group">
                      <span className="flex items-center">
                        <span className="text-primary/40 mr-6 font-sans text-base md:text-lg">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {faq.pertanyaan}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-8 pt-1 pl-[3.7rem] pr-4 md:pr-12">
                      {faq.jawaban}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



