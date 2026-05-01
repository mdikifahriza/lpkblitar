"use client";

import Link from "next/link";
import {
  Clock3,
  ExternalLink,
  FileText,
  Mail,
  MapPinned,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  ContactSettingsRecord,
  ContactSocialLink,
} from "@/lib/api/contact";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/contact";
import { SocialPlatformIcon } from "@/components/contact/SocialPlatformIcon";
import { Button } from "@/components/ui/button";

export function KontakClient({
  settings,
  contact,
  socialLinks,
}: {
  settings: Record<string, string>;
  contact: ContactSettingsRecord;
  socialLinks: ContactSocialLink[];
}) {
  const whatsappUrl = buildWhatsAppUrl(
    contact.whatsapp_number,
    contact.whatsapp_message_default
  );
  const primaryNumber = contact.whatsapp_number;
  const phoneHref = primaryNumber ? `tel:${primaryNumber.replace(/[^\d+]/g, "")}` : null;
  const emailHref = contact.email ? `mailto:${contact.email}` : null;
  const mapsLinkUrl =
    contact.maps_link_url ||
    (contact.alamat
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.alamat)}`
      : "");
  const officeName = settings.site_name || "Hutabarat Law";

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border pb-12 pt-28 md:pb-16 md:pt-36">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-4xl font-bold leading-[1.02] text-foreground md:text-5xl lg:text-[3.5rem]">
              Hubungi {officeName}
            </h1>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-3 px-7 py-6 text-base font-semibold">
                  <MessageCircle className="h-5 w-5" />
                  Chat WhatsApp
                </Button>
              </a>

              <Link href="/konsultasi" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-3 px-7 py-6 text-base font-semibold">
                  <FileText className="h-5 w-5" />
                  Isi Form Konsultasi
                </Button>
              </Link>

              {phoneHref ? (
                <a href={phoneHref} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full gap-3 px-7 py-6 text-base font-semibold">
                    <PhoneCall className="h-5 w-5" />
                    Hubungi Nomor Utama
                  </Button>
                </a>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto grid gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8"
            >
              <h2 className="font-serif text-2xl font-semibold text-foreground">Jalur Kontak</h2>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4 border-b border-border pb-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-muted-foreground">WhatsApp</div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-base font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {contact.whatsapp_number || "6281234567890"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-b border-border pb-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-muted-foreground">Nomor Utama</div>
                    {phoneHref ? (
                      <a
                        href={phoneHref}
                        className="mt-1 block text-base font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {primaryNumber}
                      </a>
                    ) : (
                      <div className="mt-1 text-base font-semibold text-foreground">
                        {normalizeWhatsAppNumber(primaryNumber) || "-"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 border-b border-border pb-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    {emailHref ? (
                      <a
                        href={emailHref}
                        className="mt-1 block break-all text-base font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {contact.email}
                      </a>
                    ) : (
                      <div className="mt-1 text-base font-semibold text-foreground">Belum tersedia</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                    <MapPinned className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-muted-foreground">Alamat Kantor</div>
                    <div className="mt-1 text-base leading-8 text-foreground">
                      {contact.alamat || "Blitar, Jawa Timur"}
                    </div>
                    {mapsLinkUrl ? (
                      <a
                        href={mapsLinkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        Buka peta
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8"
            >
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-2xl font-semibold text-foreground">Jam Kerja</h2>
              </div>
              <p className="mt-4 text-base leading-8 text-foreground">
                {contact.jam_operasional || "Senin - Jumat: 08.00 - 17.00 WIB"}
              </p>

              <div className="mt-8 border-t border-border pt-8">
                <h3 className="font-serif text-xl font-semibold text-foreground">Media Sosial</h3>
                {socialLinks.length > 0 ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {socialLinks.map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <SocialPlatformIcon platform={item.icon_key || item.platform_code} />
                        <span>{item.platform_nama}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">Belum ada link media sosial yang ditampilkan.</p>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-lg md:p-5"
          >
            {contact.maps_embed_url ? (
              <iframe
                src={contact.maps_embed_url}
                title={`Peta ${officeName}`}
                className="h-[520px] w-full rounded-xl border border-border bg-background"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-[520px] items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center text-sm text-muted-foreground">
                Peta kantor belum tersedia.
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
