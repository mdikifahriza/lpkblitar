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
} from "lucide-react";

const DIVISION_ICONS = {
  scale: Scale,
  handshake: Handshake,
  fileSearch: FileSearch,
  megaphone: Megaphone,
};

const DIVISIONS = [
  {
    name: "Lawyer Litigasi",
    icon: "scale" as const,
    description: "Divisi yang berfokus pada penanganan perkara di pengadilan, mulai dari penyusunan gugatan hingga eksekusi putusan.",
    responsibilities: [
      "Menyusun gugatan dan jawaban di pengadilan negeri.",
      "Mendampingi klien pada seluruh tahap persidangan.",
      "Menangani upaya hukum banding, kasasi, dan peninjauan kembali."
    ]
  },
  {
    name: "Non-Litigasi & Negosiasi",
    icon: "handshake" as const,
    description: "Divisi yang menangani penyelesaian sengketa di luar pengadilan melalui negosiasi, mediasi, dan restrukturisasi.",
    responsibilities: [
      "Menyusun strategi penyelesaian damai dan mediasi.",
      "Memimpin negosiasi dengan pihak lawan atau kreditur.",
      "Merumuskan akta perdamaian yang mengikat secara hukum."
    ]
  },
  {
    name: "Analisa Dokumen",
    icon: "fileSearch" as const,
    description: "Divisi khusus yang menelaah dokumen legal secara mendalam guna menemukan celah hukum untuk strategi pembelaan.",
    responsibilities: [
      "Mengaudit perjanjian kredit, akta jaminan, dan sertifikat.",
      "Menganalisa prosedur lelang, cessie, dan eksekusi sepihak.",
      "Memberikan rekomendasi tertulis tentang posisi hukum klien."
    ]
  },
  {
    name: "Pengaduan Instansi",
    icon: "megaphone" as const,
    description: "Divisi yang menangani pelaporan ke instansi pengawas untuk memberikan tekanan administratif dan mitigasi.",
    responsibilities: [
      "Menyusun laporan ke Otoritas Jasa Keuangan (OJK).",
      "Mendampingi pelaporan ke Kepolisian atas dugaan pidana.",
      "Melaporkan pelanggaran perlindungan konsumen ke BPSK."
    ]
  }
];

interface TeamMember {
  id: string;
  nama: string;
  jabatan: string;
  spesialisasi: string;
  bio?: string;
  foto_url: string;
  is_pimpinan?: boolean;
  kategori_divisi?: string;
}

export function TimClient({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");

  const divisionsList = useMemo(() => {
    const divs = new Set(initialTeam.filter(m => !m.is_pimpinan).map(m => m.kategori_divisi || m.jabatan));
    return ["Semua", ...Array.from(divs)];
  }, [initialTeam]);

  const filteredTeam = useMemo(() => {
    const members = initialTeam.filter(m => !m.is_pimpinan);
    if (activeFilter === "Semua") return members;
    return members.filter((m) => (m.kategori_divisi || m.jabatan) === activeFilter);
  }, [activeFilter, initialTeam]);

  const principal = initialTeam.find(m => m.is_pimpinan) || initialTeam[0];

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden bg-background">
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
            className="mb-10 flex items-center gap-2 text-sm text-muted-foreground"
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
            className="max-w-4xl"
          >
            <span className="text-primary uppercase tracking-[0.18em] text-xs font-medium mb-6 block">
              Tim Kami
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground font-bold leading-[1.05] mb-8">
              Tim Profesional Kami
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl">
              Setiap perkara membutuhkan ketelitian, ketegasan, dan integritas.
              Kami membangun tim lintas disiplin yang memadukan ketajaman analisa,
              pengalaman praktik di pengadilan, serta empati pada situasi setiap
              klien.
            </p>
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
                  {principal.bio?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="bg-background border border-border rounded-xl p-8">
                  <h3 className="font-serif text-2xl text-foreground font-bold mb-6 flex items-center gap-3">
                    <Award className="text-primary w-6 h-6" />
                    Area Keahlian Khusus
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                    {principal.spesialisasi.split(',').map((keahlian, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{keahlian.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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

          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {divisionsList.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as string)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1400px] mx-auto min-h-[500px] items-start">
            <AnimatePresence mode="popLayout">
              {filteredTeam.map((member, idx) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                  className="group"
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
                            <span className="block text-primary mb-1 text-xs uppercase">Spesialisasi:</span>
                            {member.spesialisasi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
              Kami mengkombinasikan 4 divisi utama agar setiap aspek perkara dari
              analisa dokumen, negosiasi, pengaduan, hingga persidangan berjalan
              optimal.
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






