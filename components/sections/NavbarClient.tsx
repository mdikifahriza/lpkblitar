"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";

interface NavbarClientProps {
  settings: Record<string, string>;
}

export function NavbarClient({ settings }: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/layanan" },
    { name: "Tim", href: "/tim" },
    { name: "Insight", href: "/artikel" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border py-4 shadow-xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col z-50">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/konsultasi" passHref>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-6 uppercase tracking-wider text-xs font-bold"
              >
                Konsultasi Sekarang
              </Button>
            </Link>
            <ThemeToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
            <ThemeToggle />
            <ThemeToggle />
      </div>
    </nav>
  );
}


