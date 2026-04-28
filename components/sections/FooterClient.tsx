"use client";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

interface FooterClientProps {
  settings: Record<string, string>;
}

export function FooterClient({ settings }: FooterClientProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background pt-20 pb-10 border-t border-primary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-serif text-2xl font-bold text-primary tracking-wider">
              {settings.site_name?.split(" ")[0] || "HUTABARAT"} <span className="text-foreground">LAW</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm pr-4">
              {settings.site_description || "Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha."}
            </p>
            <div className="flex gap-4">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold text-foreground mb-6">
              Menu Navigasi
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "Beranda", href: "/" },
                { name: "Layanan Kami", href: "/layanan" },
                { name: "Tim Profesional", href: "/tim" },
                { name: "Insight Hukum", href: "/artikel" },
                { name: "Konsultasi", href: "/konsultasi" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-xl font-bold text-foreground mb-6">
              Fokus Layanan
            </h4>
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

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl font-bold text-foreground mb-6">
              Hubungi Kami
            </h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm leading-relaxed">
                  {settings.alamat || "Blitar, Jawa Timur"}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {settings.phone_number || "(0342) 123456"}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {settings.email || "info@hutabaratlawoffice.com"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            &copy; {currentYear} {settings.site_name || "Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA"}. Hak Cipta Dilindungi.
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

