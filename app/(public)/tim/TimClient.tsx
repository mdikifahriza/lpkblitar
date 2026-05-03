"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Award,
  Scale,
  Handshake,
  FileSearch,
  Megaphone,
  Check,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import { FilterChipRail } from "@/components/ui/filter-chip-rail";
import { Button } from "@/components/ui/button";

const DIVISION_ICONS = {
  scale: Scale,
  handshake: Handshake,
  fileSearch: FileSearch,
  megaphone: Megaphone,
  shieldCheck: ShieldCheck,
  users: Users,
};

const DIVISIONS = [
  {
    name: "Litigasi",
    icon: "scale" as const,
    description:
      "Divisi yang berfokus pada penanganan perkara di pengadilan, mulai dari penyusunan gugatan hingga eksekusi putusan.",
    responsibilities: [
      "Menyusun gugatan dan jawaban di pengadilan negeri.",
      "Mendampingi klien pada seluruh tahap persidangan.",
      "Menangani upaya hukum banding, kasasi, dan peninjauan kembali.",
    ],
  },
  {
    name: "Non-Litigasi",
    icon: "shieldCheck" as const,
    description:
      "Divisi yang menangani permasalahan hukum melalui mekanisme di luar jalur pengadilan dengan pendekatan preventif, konsultatif, dan solutif.",
    responsibilities: [
      "Konsultasi hukum, drafting, dan review kontrak atau perjanjian.",
      "Pemberian legal opinion dan analisis yuridis komprehensif.",
      "Pendampingan restrukturisasi kewajiban dan penyelesaian sengketa musyawarah.",
    ],
  },
  {
    name: "Mediasi",
    icon: "users" as const,
    description:
      "Divisi yang menjadi jembatan penyelesaian antara masyarakat dengan pihak bank, leasing, finance, koperasi, dan developer melalui pendekatan mediasi.",
    responsibilities: [
      "Somasi, mediasi, dan permohonan restrukturisasi kredit.",
      "Investigasi fakta lapangan dan verifikasi legalitas dokumen.",
      "Pembentukan forum musyawarah penyelesaian sengketa.",
    ],
  },
  {
    name: "Negosiasi",
    icon: "handshake" as const,
    description:
      "Divisi yang menyelesaikan sengketa melalui jalur negosiasi langsung antara para pihak guna mencapai kesepakatan yang adil, cepat, dan mengikat secara hukum.",
    responsibilities: [
      "Negosiasi finance dan perdamaian antara kreditur dan debitur.",
      "Penyelesaian komplain konsumen dan penyusunan legal notice.",
      "Penyusunan akta perdamaian atau kesepakatan tertulis yang sah.",
    ],
  },
  {
    name: "Investigasi",
    icon: "fileSearch" as const,
    description:
      "Divisi khusus yang menelaah fakta, mengumpulkan bukti, serta menganalisis mendalam permasalahan hukum guna memperoleh informasi yang akurat dan dapat dipertanggungjawabkan.",
    responsibilities: [
      "Investigasi lapangan, wawancara, dan pengumpulan dokumen bukti.",
      "Penelusuran aset dan due diligence investigatif.",
      "Penyusunan laporan investigasi komprehensif untuk kebutuhan litigasi maupun non-litigasi.",
    ],
  },
  {
    name: "Pengaduan Instansi",
    icon: "megaphone" as const,
    description:
      "Divisi yang menangani pelaporan ke instansi pengawas untuk memberikan tekanan administratif dan perlindungan hukum bagi klien.",
    responsibilities: [
      "Menyusun laporan ke OJK, BPSK, Dinas Koperasi, Satgas Waspada Investasi, dan Disperindag.",
      "Mendampingi pelaporan ke Kepolisian atas dugaan unsur pidana.",
      "Mengajukan pengaduan ke instansi perlindungan konsumen.",
    ],
  },
];

function getMobileDivisionLabel(label: string) {
  if (label === "Semua") return label;

  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("non-litigasi")) return "Non-Litigasi";
  if (normalizedLabel.includes("litigasi")) return "Litigasi";
  if (normalizedLabel.includes("mediasi")) return "Mediasi";
  if (normalizedLabel.includes("negosiasi")) return "Negosiasi";
  if (normalizedLabel.includes("investigasi")) return "Investigasi";
  if (normalizedLabel.includes("pengaduan")) return "Pengaduan";

  const shortLabel = label.split("&")[0]?.trim();
  return shortLabel || label;
}

interface TeamMember {
  id: string;
  slug: string;
  nama: string;
  jabatan: string;
  spesialisasi: string;
  bio?: string | null;
  foto_url: string;
  is_pimpinan?: boolean;
  kategori_divisi?: string | null;
}

export function TimClient({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");

  const divisionsList = useMemo(() => {
    const divs = new Set(
      initialTeam
        .filter((m) => !m.is_pimpinan)
        .map((m) => m.kategori_divisi || m.jabatan)
    );
    return ["Semua", ...Array.from(divs)];
  }, [initialTeam]);

  const filteredTeam = useMemo(() => {
    const members = initialTeam.filter((m) => !m.is_pimpinan);
    if (activeFilter === "Semua") return members;
    return members.filter(
      (m) => (m.kategori_divisi || m.jabatan) === activeFilter
    );
  }, [activeFilter, initialTeam]);

  const principal = initialTeam.find((m) => m.is_pimpinan) || initialTeam[0];

  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-background pb-14 pt-32 md:pb-20 md:pt-40">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary opacity-[0.05] blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground md:mb-8"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-foreground">Tim</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-4xl font-bold leading-[1.02] text-foreground md:text-5xl lg:text-6xl">
              Tim Profesional Kami
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Profil Pimpinan */}
      {principal && (
        <section className="bg-secondary py-20 md:py-28 border-t border-border">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center"
            >
              <div className="w-full lg:w-5/12">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-xl opacity-20 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-border">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 z-10 mix-blend-multiply" />
                    <SafeImage
                      src={principal.foto_url}
                      alt={principal.nama}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-7/12">
                <div className="mb-8">
                  <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold mb-4">
                    {principal.nama}
                  </h2>
                  <p className="text-primary text-lg font-medium tracking-wide uppercase">
                    {principal.jabatan}
                  </p>
                </div>

                <div className="prose prose-lg prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed mb-10 max-w-none">
                  {principal.bio?.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="bg-background border border-border rounded-xl p-8">
                  <h3 className="font-serif text-2xl text-foreground font-bold mb-6 flex items-center gap-3">
                    <Award className="text-primary w-6 h-6" />
                    Area Keahlian Khusus
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                    {principal.spesialisasi.split(",").map((keahlian, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          {keahlian.trim()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild className="mt-8">
                  <Link href={`/tim/${principal.slug}`}>
                    Lihat Profil Lengkap
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Grid Tim Lainnya */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
            <span className="text-primary uppercase tracking-[0.18em] text-xs font-medium mb-4 block">
              Struktur Organisasi
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight mb-6">
              Jajaran Spesialis Kami
            </h2>
            <p className="text-muted-foreground text-lg">
              Setiap anggota ditempatkan sesuai keahlian tertajamnya untuk
              memastikan efisiensi penyelesaian perkara.
            </p>
          </div>

          <div className="mb-12 md:mb-16">
            <FilterChipRail
              options={divisionsList.map((filter) => ({
                value: filter,
                label: filter,
                mobileLabel: getMobileDivisionLabel(filter),
              }))}
              activeValue={activeFilter}
              onChange={setActiveFilter}
              desktopClassName="md:justify-center md:gap-2"
              buttonClassName="md:px-6 md:py-2.5 md:text-sm md:font-medium md:tracking-wider"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-[1400px] mx-auto min-h-[500px] items-start">
            <AnimatePresence mode="popLayout">
              {filteredTeam.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                  className="h-full"
                >
                  <Link
                    href={`/tim/${member.slug}`}
                    className="group block h-full focus-visible:outline-none"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-card border border-border">
                      <SafeImage
                        src={member.foto_url}
                        alt={member.nama}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12] via-[#0a0d12]/40 to-transparent opacity-80 transition-opacity duration-300" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <span className="text-primary font-medium tracking-wider text-[10px] uppercase mb-2 block">
                            {member.jabatan}
                          </span>
                          <h3 className="font-serif text-2xl text-foreground font-bold mb-3 leading-tight">
                            {member.nama}
                          </h3>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
                            <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-4 mt-2">
                              <span className="block text-primary mb-1 text-xs uppercase">
                                Spesialisasi:
                              </span>
                              {member.spesialisasi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Deskripsi Divisi */}
      <section className="py-20 md:py-32 bg-secondary border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16 md:mb-20 max-w-3xl">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight mb-6">
              Pembagian Tugas <span className="text-primary">Strategis</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Kami mengkombinasikan 6 divisi utama agar setiap aspek perkara —
              dari investigasi, negosiasi, mediasi, pengaduan, hingga persidangan
              — berjalan optimal dan terkoordinasi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {DIVISIONS.map((div, idx) => {
              const Icon = DIVISION_ICONS[div.icon as keyof typeof DIVISION_ICONS];
              return (
                <motion.div
                  key={div.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-background border border-border p-10 rounded-2xl hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-foreground font-bold mb-2">
                        {div.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {div.description}
                      </p>
                    </div>
                  </div>
                  <div className="pl-20">
                    <ul className="space-y-3">
                      {div.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                          <span className="text-muted-foreground text-sm leading-relaxed">
                            {resp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
