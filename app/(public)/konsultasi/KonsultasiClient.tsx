"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, MapPin, Phone, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactSettingsRecord } from "@/lib/api/contact";
import { buildWhatsAppUrl } from "@/lib/contact";
import { submitInquiry } from "./actions";

// Form Schema
const formSchema = z.object({
  layanan_id: z.string().min(1, { message: "Pilih jenis masalah Anda" }),
  namaLengkap: z.string().min(2, { message: "Nama wajib diisi" }),
  noHp: z.string()
    .min(11, { message: "Nomor HP minimal 11 digit angka" })
    .regex(/^0[0-9]+$/, { message: "Nomor harus diawali dengan 0 dan hanya berisi angka (contoh: 0812...)" }),
  email: z.string().email({ message: "Email tidak valid" }).optional().or(z.literal("")),
  kota: z.string().min(2, { message: "Kota wajib diisi" }),
  kronologi: z.string().min(20, { message: "Mohon ceritakan kronologi secara lebih detail" }),
  persetujuan: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui pernyataan ini",
  }),
});

type ServiceSummary = {
  id: string;
  nama: string;
};

export function KonsultasiClient({
  contact,
  services,
}: {
  contact: ContactSettingsRecord;
  services: ServiceSummary[];
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(contact.whatsapp_number);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      layanan_id: "",
      namaLengkap: "",
      noHp: "",
      email: "",
      kota: "",
      kronologi: "",
      persetujuan: false,
    },
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["layanan_id"]);
    } else if (step === 2) {
      isValid = await form.trigger(["namaLengkap", "noHp", "email", "kota"]);
    } else if (step === 3) {
      isValid = await form.trigger(["kronologi"]);
    }

    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await submitInquiry(values);
      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
      } else {
        setIsSuccess(true);
        
        // Prepare WhatsApp Message
        const selectedService = services.find(s => s.id === values.layanan_id)?.nama || "Lainnya";
        const waMessage = `*Pesan Konsultasi Baru dari Website*\n\nNama: ${values.namaLengkap}\nNo. HP: ${values.noHp}\nEmail: ${values.email || '-'}\nKota: ${values.kota}\nLayanan Terkait: ${selectedService}\n\n*Kronologi Masalah:*\n${values.kronologi}`;
        
        const waUrl = buildWhatsAppUrl(contact.whatsapp_number, waMessage);
        
        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');
      }
    } catch {
      toast.error("Terjadi kesalahan sistem. Silakan hubungi via WhatsApp.");
      setIsSubmitting(false);
    }
  }

  // --- Success State Render ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-10 md:p-16 max-w-xl w-full text-center mx-4 shadow-xl"
        >
          <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Terima Kasih!
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Data konsultasi awal Anda telah kami terima dan juga diarahkan ke WhatsApp kami. Tim hukum kami akan segera
            meninjau informasi ini dan membalas pesan Anda.
          </p>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 uppercase tracking-wider font-bold">
              Kembali ke Beranda
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h1 className="font-serif text-4xl font-bold leading-[1.02] text-foreground md:text-5xl lg:text-[3.5rem]">
            Mulai Konsultasi Anda
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 max-w-6xl mx-auto">
            
            {/* Left: Form */}
            <div className="lg:w-3/5">
              <div className="bg-card border border-border rounded-xl p-6 md:p-10 shadow-lg">
                {/* Progress Bar */}
                <div className="mb-10">
                  <div className="flex justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span>Jenis Masalah</span>
                    <span>Data Diri</span>
                    <span>Detail</span>
                    <span>Kirim</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "25%" }}
                      animate={{ width: `${(step / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <AnimatePresence mode="wait">
                      {/* STEP 1: Jenis Masalah */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <h3 className="font-serif text-2xl text-foreground font-bold mb-6 border-b border-border pb-4">
                            Apa masalah hukum yang Anda hadapi?
                          </h3>
                          <FormField
                            control={form.control}
                            name="layanan_id"
                            render={({ field }) => (
                              <FormItem className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {services.map((srv) => (
                                    <div
                                      key={srv.id}
                                      onClick={() => field.onChange(srv.id)}
                                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        field.value === srv.id
                                          ? "border-primary bg-primary/10 text-primary"
                                          : "border-border bg-background text-muted-foreground hover:border-border hover:text-foreground"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center ${field.value === srv.id ? "border-primary" : "border-muted-foreground"}`}>
                                          {field.value === srv.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <span className="font-medium text-sm leading-tight">{srv.nama}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage className="text-red-500 font-medium mt-2" />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {/* STEP 2: Data Diri */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <h3 className="font-serif text-2xl text-foreground font-bold mb-6 border-b border-border pb-4">
                            Informasi Kontak Anda
                          </h3>
                          <FormField
                            control={form.control}
                            name="namaLengkap"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground">Nama Lengkap *</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="bg-background border-border text-foreground h-12 focus-visible:ring-primary" />
                                </FormControl>
                                <FormMessage className="text-red-500 font-medium" />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="noHp"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground">No. WhatsApp *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="081234567890" type="tel" {...field} className="bg-background border-border text-foreground h-12 focus-visible:ring-primary" />
                                  </FormControl>
                                  <p className="text-[11px] text-muted-foreground mt-1">Gunakan angka saja diawali dengan 0 (Bukan +62).</p>
                                  <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground">Email (Opsional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@contoh.com" type="email" {...field} className="bg-background border-border text-foreground h-12 focus-visible:ring-primary" />
                                  </FormControl>
                                  <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="kota"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground">Kota Domisili *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contoh: Blitar" {...field} className="bg-background border-border text-foreground h-12 focus-visible:ring-primary" />
                                </FormControl>
                                <FormMessage className="text-red-500 font-medium" />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {/* STEP 3: Kronologi */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <h3 className="font-serif text-2xl text-foreground font-bold mb-6 border-b border-border pb-4">
                            Detail Permasalahan
                          </h3>
                          <FormField
                            control={form.control}
                            name="kronologi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground">Ceritakan Pesan / Kronologi Anda *</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Jelaskan secara detail pesan atau kronologi hukum Anda di sini..." 
                                    className="bg-background border-border text-foreground min-h-[250px] resize-y focus-visible:ring-primary leading-relaxed"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 font-medium" />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {/* STEP 4: Konfirmasi */}
                      {step === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <h3 className="font-serif text-2xl text-foreground font-bold mb-6 border-b border-border pb-4">
                            Konfirmasi Pengiriman
                          </h3>
                          
                          <div className="bg-background border border-border rounded-lg p-6 space-y-4 mb-6">
                            <div>
                              <span className="text-muted-foreground text-sm block mb-1">Layanan Pilihan:</span>
                              <span className="text-foreground font-medium">{services.find(s => s.id === form.getValues().layanan_id)?.nama || "Lainnya"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-sm block mb-1">Pengirim:</span>
                              <span className="text-foreground font-medium">{form.getValues().namaLengkap} ({form.getValues().noHp})</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-sm block mb-1">Domisili:</span>
                              <span className="text-foreground font-medium">{form.getValues().kota}</span>
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name="persetujuan"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border bg-background p-4">
                                <FormControl>
                                  <div 
                                    className={`shrink-0 w-5 h-5 rounded border mt-0.5 flex items-center justify-center cursor-pointer transition-colors ${field.value ? "bg-primary border-primary" : "border-muted-foreground hover:border-primary"}`}
                                    onClick={() => field.onChange(!field.value)}
                                  >
                                    {field.value && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                                  </div>
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-muted-foreground font-normal leading-relaxed cursor-pointer" onClick={() => field.onChange(!field.value)}>
                                    Saya menyatakan bahwa informasi yang saya berikan adalah benar dan saya menyetujui data ini diolah oleh tim konsultan hukum untuk keperluan analisa awal perkara.
                                  </FormLabel>
                                  <FormMessage className="text-red-500 font-medium pt-2" />
                                </div>
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-8 border-t border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1 || isSubmitting}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Kembali
                      </Button>

                      {step < 4 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                        >
                          Lanjut
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                        >
                          {isSubmitting ? "Mengirim..." : "Kirim & Lanjut WA"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            {/* Right: Contact Info */}
            <div className="lg:w-2/5">
              <div className="sticky top-32 space-y-8">
                <div className="bg-secondary border border-border rounded-xl p-8 shadow-sm">
                  <h3 className="font-serif text-2xl text-foreground font-bold mb-6">
                    Kontak Alternatif
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Anda juga dapat langsung menghubungi kami melalui WhatsApp atau datang langsung ke kantor kami.
                  </p>
                  
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="block text-muted-foreground text-sm mb-1">WhatsApp</span>
                        <a
                          href={whatsappUrl}
                          className="text-foreground font-medium hover:text-primary transition-colors"
                        >
                          {contact.whatsapp_number || "6281234567890"}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="block text-muted-foreground text-sm mb-1">Email</span>
                        <a href={`mailto:${contact.email || 'info@hutabaratlawoffice.com'}`} className="text-foreground font-medium hover:text-primary transition-colors">
                          {contact.email || "info@hutabaratlawoffice.com"}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="block text-muted-foreground text-sm mb-1">Alamat Kantor</span>
                        <span className="text-foreground font-medium leading-relaxed block">
                          {contact.alamat || "Blitar, Jawa Timur"}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
                  <h3 className="font-serif text-xl text-primary font-bold mb-4 flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    Yang Terjadi Selanjutnya
                  </h3>
                  <ol className="relative border-l border-primary/30 ml-3 space-y-6">
                    <li className="pl-6">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] mt-1.5" />
                      <h4 className="text-foreground font-medium mb-1">Tim kami menganalisa form</h4>
                      <p className="text-muted-foreground text-sm">Review awal dalam 1x24 jam kerja.</p>
                    </li>
                    <li className="pl-6">
                      <div className="absolute w-3 h-3 bg-primary/50 rounded-full -left-[6.5px] mt-1.5" />
                      <h4 className="text-foreground font-medium mb-1">Kami menghubungi Anda</h4>
                      <p className="text-muted-foreground text-sm">Untuk penjadwalan sesi konsultasi.</p>
                    </li>
                    <li className="pl-6">
                      <div className="absolute w-3 h-3 bg-primary/30 rounded-full -left-[6.5px] mt-1.5" />
                      <h4 className="text-foreground font-medium mb-1">Penawaran Solusi Hukum</h4>
                      <p className="text-muted-foreground text-sm">Pembuatan strategi dan estimasi biaya.</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

