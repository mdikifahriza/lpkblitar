"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Check,
  AlertCircle,
  FileText,
  MessageCircle,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildWhatsAppUrl } from "@/lib/contact";
import type { ServiceRow } from "@/lib/api/services";
import NotFound from "@/app/not-found";

function buildWhatsAppHref(service: ServiceRow, whatsappNumber?: string | null) {
  const message = `Halo, saya ingin berkonsultasi mengenai layanan "${service.nama}". Mohon informasi lebih lanjut.`;
  return buildWhatsAppUrl(whatsappNumber, message);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function LayananDetailClient({
  service,
  relatedServices,
  whatsappNumber,
}: {
  service: ServiceRow;
  relatedServices: ServiceRow[];
  whatsappNumber?: string | null;
}) {
  
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service?.id]);

  if (!service) {
    return <NotFound />;
  }

  const shortDescription = service.deskripsi_singkat?.trim() || "";
  const longDescription = service.deskripsi_lengkap?.trim() || "";
  const cleanedLongDescription =
    shortDescription && longDescription
      ? longDescription
          .replace(new RegExp(`^${escapeRegExp(shortDescription)}(?:\\s+|\\n+)*`, "i"), "")
          .trim()
      : longDescription;
  const introDescription =
    cleanedLongDescription.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)[0] ||
    shortDescription ||
    "Layanan ini berfokus pada penyelesaian sengketa hukum dengan pendekatan yang efektif dan strategis. Kami menggabungkan ketajaman analisa dokumen dengan keahlian negosiasi maupun litigasi untuk mencapai hasil terbaik bagi klien.";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 noise-bg bg-background border-b border-border relative overflow-hidden">
        {/* Subtle accent gradient */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/layanan" className="hover:text-primary transition-colors">
              Layanan
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{service.nama}</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-6">
              {service.kategori.replace("-", " ")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              {service.nama}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {service.deskripsi_singkat}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Column - Details */}
            <div className="lg:w-2/3 space-y-12">
              {/* Apa Itu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                  <span className="text-primary">
                    <FileText className="w-6 h-6" />
                  </span>
                  Apa Itu {service.nama}?
                </h2>
                <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed">
                  <p>{introDescription}</p>
                  <p>
                    Tim profesional kami akan mendampingi Anda di setiap tahap
                    proses hukum, mulai dari konsultasi awal, pengumpulan dan
                    analisa bukti, penyusunan argumen, hingga perwakilan di
                    hadapan pihak lawan maupun pengadilan jika diperlukan.
                  </p>
                </div>
              </motion.div>

              {/* Kapan Membutuhkan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                  <span className="text-primary">
                    <AlertCircle className="w-6 h-6" />
                  </span>
                  Kapan Anda Membutuhkan Ini?
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Menghadapi sengketa kontrak atau perjanjian",
                    "Mendapat ancaman hukum atau gugatan",
                    "Terjadi kerugian akibat tindakan pihak lain",
                    "Membutuhkan perlindungan hak sebagai konsumen",
                    "Aset berisiko dieksekusi secara sepihak",
                    "Perselisihan dalam aktivitas bisnis",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border"
                    >
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Proses Penanganan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                  <span className="text-primary">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  Proses Penanganan
                </h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                  {[
                    {
                      title: "Konsultasi & Identifikasi",
                      desc: "Mendengarkan kronologi masalah dan mengidentifikasi posisi hukum Anda.",
                    },
                    {
                      title: "Analisa Dokumen",
                      desc: "Membedah setiap detail dokumen terkait untuk menemukan celah hukum.",
                    },
                    {
                      title: "Penyusunan Strategi",
                      desc: "Merumuskan langkah-langkah terukur baik melalui litigasi maupun non-litigasi.",
                    },
                    {
                      title: "Eksekusi & Penyelesaian",
                      desc: "Melaksanakan strategi hukum hingga mencapai penyelesaian yang menguntungkan.",
                    },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-card text-primary font-bold z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_2px_hsl(var(--primary)_/_0.3)]">
                        {idx + 1}
                      </div>
                      {/* Content */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl border border-border bg-card/50">
                        <h3 className="font-bold text-foreground mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Dokumen yang Dibutuhkan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border p-8 rounded-xl"
              >
                <h3 className="text-xl font-serif font-bold mb-4 text-foreground">
                  Dokumen yang Perlu Disiapkan
                </h3>
                <p className="text-muted-foreground mb-6">
                  Untuk mempercepat proses analisa awal, sebaiknya siapkan
                  dokumen-dokumen berikut (jika ada):
                </p>
                <ul className="space-y-3">
                  {[
                    "Salinan Perjanjian/Kontrak terkait",
                    "Bukti korespondensi (surat menyurat, email, chat WhatsApp)",
                    "Dokumen legalitas (KTP, NPWP, Akta Perusahaan)",
                    "Bukti transaksi/pembayaran (jika terkait masalah finansial)",
                    "Surat penagihan atau somasi (jika sudah menerima)",
                  ].map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 space-y-8">
                {/* CTA Card */}
                <div className="bg-secondary rounded-xl p-8 border border-border">
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Butuh Bantuan Segera?
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Jangan tunda penyelesaian masalah hukum Anda. Tim kami siap
                    menganalisa dan memberikan solusi terbaik.
                  </p>

                  <div className="space-y-4">
                    <a
                      href={buildWhatsAppHref(service, whatsappNumber)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-medium transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Konsultasi via WhatsApp
                    </a>

                    <Button
                      variant="outline"
                      className="w-full py-6 text-base border-primary/50 text-foreground hover:bg-primary/10"
                    >
                      Isi Form Konsultasi
                    </Button>
                  </div>
                </div>

                {/* FAQ Accordion (Specific) */}
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Pertanyaan Terkait
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {[
                      {
                        q: `Berapa lama proses ${service.nama}?`,
                        a: "Durasi sangat bergantung pada kompleksitas kasus dan itikad baik dari pihak lawan. Kami mengupayakan penyelesaian secepat mungkin.",
                      },
                      {
                        q: "Apakah peluang menangnya besar?",
                        a: "Kami tidak pernah menjanjikan kemenangan secara mutlak, namun kami memastikan argumen hukum dibangun berdasarkan analisa dokumen yang tajam dan tak terbantahkan.",
                      },
                      {
                        q: "Bagaimana sistem biayanya?",
                        a: "Biaya penanganan perkara akan diinformasikan secara transparan setelah kami meninjau kerumitan masalah dan dokumen yang ada pada sesi konsultasi awal.",
                      },
                    ].map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="border-b border-border/50"
                      >
                        <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors py-4">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 bg-secondary/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold">Layanan Terkait</h2>
              <p className="text-muted-foreground mt-2">
                Eksplorasi layanan kami lainnya
              </p>
            </div>
            <Link href="/layanan" passHref>
              <Button variant="ghost" className="hidden sm:flex gap-2">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((relatedService, idx) => (
              <motion.div
                key={relatedService.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link href={`/layanan/${relatedService.slug}`} passHref>
                  <div className="group block h-full p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {relatedService.nama}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                      {relatedService.deskripsi_singkat}
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm">
                      Pelajari Lebih Lanjut
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      </div>
  );
}



