"use client";

import Link from "next/link";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { ContactSettingsRecord, ContactSocialLink } from "@/lib/api/contact";
import { SocialPlatformIcon } from "@/components/contact/SocialPlatformIcon";
import { SafeImage } from "@/components/ui/safe-image";

interface FooterClientProps {
  settings: Record<string, string>;
  contact: ContactSettingsRecord;
  socialLinks: ContactSocialLink[];
}

export function FooterClient({ settings, contact, socialLinks }: FooterClientProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#00365A] text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div className="flex flex-col gap-6">
              <Link href="/" className="inline-block">
                {settings.logo_url ? (
                  <SafeImage
                    src={settings.logo_url}
                    alt={settings.site_name || "Logo"}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="font-serif text-3xl font-bold text-white inline-block">
                    {settings.site_name || "HUTABARAT LAW"}
                  </div>
                )}
              </Link>
              <p className="text-white/80 leading-relaxed text-sm pr-4 mt-2">
                {settings.site_name || "Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha."}
              </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-all"
                  aria-label={item.platform_nama}
                  title={item.platform_nama}
                >
                  <SocialPlatformIcon platform={item.icon_key || item.platform_code} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-6">Menu Navigasi</h4>
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
                  <Link href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-6">Hubungi Kami</h4>
            <ul className="flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                  <span className="text-white/80 text-sm leading-relaxed">
                    {contact.alamat || "Blitar, Jawa Timur"}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-white/70 shrink-0" />
                  <span className="text-white/80 text-sm">
                    {contact.whatsapp_number || "-"}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-white/70 shrink-0" />
                  <span className="text-white/80 text-sm">
                    {contact.email || "info@hutabaratlawoffice.com"}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Clock3 className="w-5 h-5 text-white/70 shrink-0" />
                  <span className="text-white/80 text-sm">
                  {contact.jam_operasional || "Senin - Jumat: 08.00 - 17.00 WIB"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            &copy; {currentYear}{" "}
            {settings.site_name || "Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA"}. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
