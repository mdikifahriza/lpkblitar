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
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/3"
          >
            <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
              Pertanyaan Umum
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight mb-8">
              Bantuan Cepat
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Temukan jawaban dari pertanyaan yang sering diajukan. Jika Anda
              tidak menemukan jawaban yang Anda cari, silakan hubungi tim kami.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-2/3"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${idx}`}
                  className="border-b border-border mb-4"
                >
                  <AccordionTrigger className="text-left font-serif text-2xl text-foreground hover:text-primary hover:no-underline py-6 transition-colors group">
                    <span className="flex items-center">
                      <span className="text-primary mr-4 opacity-50 font-sans text-lg">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {faq.pertanyaan}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-8 pt-2 pl-[3.25rem]">
                    {faq.jawaban}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



