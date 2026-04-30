"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

interface NavbarClientProps {
  settings: Record<string, string>;
}

export function NavbarClient({ settings }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/layanan" },
    { name: "Galeri", href: "/galeri" },
    { name: "Tim", href: "/tim" },
    { name: "Insight", href: "/artikel" },
    { name: "Kontak", href: "/kontak" },
    { name: "Daftar Konsultasi", href: "/daftar-konsultasi" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 md:px-8 relative z-50 py-4">
        <div className="flex items-center justify-between">
          <Link href="/admin/login" className="flex flex-col z-50" onClick={() => setIsMobileMenuOpen(false)}>
            {settings.logo_url ? (
              <SafeImage src={settings.logo_url} alt="Logo" className="h-10 w-auto" />
            ) : (
              <>
                <span className="font-serif text-2xl font-bold text-primary tracking-wider leading-none">
                  HUTABARAT <span className="text-foreground">LAW</span>
                </span>
                <span className="text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em] mt-1">
                  Konsultan Hukum
                </span>
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground hover:text-primary text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/konsultasi" passHref>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-5 uppercase tracking-wider text-xs font-bold"
              >
                Konsultasi Sekarang
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-4 z-50">
            <ThemeToggle />
            <button className="text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out flex flex-col justify-center items-center ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <ul className="flex flex-col items-center gap-8 mb-12">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="font-serif text-3xl text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/konsultasi" passHref>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 uppercase tracking-widest font-bold"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Konsultasi Sekarang
          </Button>
        </Link>
      </div>
    </nav>
  );
}
