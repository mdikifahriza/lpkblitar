"use client";

import Link from "next/link";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { ContactSettingsRecord, ContactSocialLink } from "@/lib/api/contact";
import { SocialPlatformIcon } from "@/components/contact/SocialPlatformIcon";

interface FooterClientProps {
  settings: Record<string, string>;
  contact: ContactSettingsRecord;
  socialLinks: ContactSocialLink[];
}

export function FooterClient({ settings, contact, socialLinks }: FooterClientProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background pt-20 pb-10 border-t border-primary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-serif text-2xl font-bold text-primary tracking-wider">
              {settings.site_name?.split(" ")[0] || "HUTABARAT"} <span className="text-foreground">LAW</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm pr-4">
              {settings.site_description ||
                "Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha."}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                  aria-label={item.platform_nama}
                  title={item.platform_nama}
                >
                  <SocialPlatformIcon platform={item.icon_key || item.platform_code} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-foreground mb-6">Menu Navigasi</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "Beranda", href: "/" },
                { name: "Layanan Kami", href: "/layanan" },
                { name: "Galeri", href: "/galeri" },
                { name: "Tim Profesional", href: "/tim" },
                { name: "Insight Hukum", href: "/artikel" },
                { name: "Kontak", href: "/kontak" },
                { name: "Daftar Konsultasi", href: "/daftar-konsultasi" },
                { name: "Konsultasi", href: "/konsultasi" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-foreground mb-6">Fokus Layanan</h4>
            <ul className="flex flex-col gap-4">
              {[
                "Sengketa Finance & Perbankan",
                "Perlindungan Konsumen",
                "Gugatan Perdata",
                "Analisa Lelang & Cessie",
                "Mediasi & Negosiasi Bisnis",
              ].map((service) => (
                <li key={service} className="text-muted-foreground text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-foreground mb-6">Hubungi Kami</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm leading-relaxed">
                  {contact.alamat || "Blitar, Jawa Timur"}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {contact.whatsapp_number || "6281234567890"}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {contact.email || "info@hutabaratlawoffice.com"}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Clock3 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {contact.jam_operasional || "Senin - Jumat: 08.00 - 17.00 WIB"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            &copy; {currentYear}{" "}
            {settings.site_name || "Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA"}. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
