"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

interface Article {
  id: string;
  slug: string;
  judul: string;
  kategori: string;
  thumbnail_url: string;
  published_at: string;
  estimasi_baca: number;
  konten?: string;
  featured?: boolean;
}

export function ArtikelClient({ initialArticles }: { initialArticles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const cats = new Set(initialArticles.map(a => a.kategori));
    return ["Semua", ...Array.from(cats)];
  }, [initialArticles]);

  const featured = useMemo<Article | undefined>(
    () => initialArticles.find((a) => a.featured) ?? initialArticles[0],
    [initialArticles],
  );

  const restArticles = useMemo(() => {
    return initialArticles.filter((a) => a.slug !== featured?.slug);
  }, [featured, initialArticles]);

  const filteredArticles = useMemo(() => {
    if (activeFilter === "Semua") return restArticles;
    return restArticles.filter((a) => a.kategori === activeFilter);
  }, [activeFilter, restArticles]);

  const visibleArticles = filteredArticles.slice(0, visible);
  const hasMore = visible < filteredArticles.length;

  const handleFilterChange = (cat: string) => {
    setActiveFilter(cat);
    setVisible(PAGE_SIZE);
  };

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
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary opacity-[0.05] blur-[120px] pointer-events-none" />

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
            <span className="text-foreground">Insight Hukum</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-4xl"
          >
            <span className="text-primary uppercase tracking-[0.18em] text-xs font-medium mb-6 block">
              Publikasi & Analisa
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground font-bold leading-[1.05] mb-8">
              Insight Hukum Terkini
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl">
              Artikel edukatif dan tajam seputar sengketa finance, perbankan,
              perlindungan konsumen, dan manajemen risiko legal untuk pelaku
              usaha di Indonesia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-12 md:py-20 bg-secondary border-t border-border">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-background border border-border rounded-2xl overflow-hidden group"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-3/5 relative overflow-hidden aspect-video lg:aspect-auto min-h-[300px]">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-primary text-[#0d1117] text-xs font-bold uppercase tracking-wider rounded-sm shadow-md">
                      Artikel Utama
                    </span>
                  </div>
                  <SafeImage
                    src={featured.thumbnail_url}
                    alt={featured.judul}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0d1117] lg:from-transparent to-transparent opacity-80" />
                </div>
                <div className="w-full lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6">
                    <span className="text-primary font-medium tracking-wider uppercase">
                      {featured.kategori.replace("-", " ")}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(featured.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6 leading-tight group-hover:text-primary transition-colors">
                    {featured.judul}
                  </h2>

                  <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-4">
                    {featured.konten?.substring(0, 150)}...
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      {featured.estimasi_baca} min read
                    </span>
                    <Link href={`/artikel/${featured.slug}`} passHref>
                      <Button
                        variant="link"
                        className="text-primary p-0 h-auto hover:text-primary/80 hover:no-underline font-medium tracking-wide uppercase text-sm group/btn"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Grid Artikel Terkini */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16 md:mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-primary uppercase tracking-[0.18em] text-xs font-medium mb-4 block">
                Katalog Publikasi
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight mb-6">
                Telusuri Berdasarkan Topik
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {categories.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-primary text-[#0d1117]"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary"
                  }`}
                >
                  {filter.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground text-lg">
                Belum ada artikel untuk kategori ini.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                  {visibleArticles.map((article, idx) => (
                    <motion.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors duration-300 h-full"
                    >
                      <Link
                        href={`/artikel/${article.slug}`}
                        className="flex flex-col h-full"
                      >
                        <div className="relative aspect-video overflow-hidden bg-background">
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 bg-[#0a0d12]/80 backdrop-blur-md border border-border text-[10px] font-medium text-foreground uppercase tracking-wider rounded-sm">
                              {article.kategori.replace("-", " ")}
                            </span>
                          </div>
                          <SafeImage
                            src={article.thumbnail_url}
                            alt={article.judul}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                          />
                        </div>

                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-4 flex items-center gap-3">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(article.published_at).toLocaleDateString(
                                "id-ID",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          <h3 className="text-xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                            {article.judul}
                          </h3>

                          <div className="mt-auto border-t border-border pt-6 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" />
                              {article.estimasi_baca} min read
                            </span>
                            <span className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                              <ArrowRight className="w-5 h-5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {hasMore && (
                <div className="mt-16 text-center">
                  <Button
                    onClick={() => setVisible((prev) => prev + PAGE_SIZE)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-[#0d1117] px-8 py-6 h-auto tracking-wider text-sm font-medium uppercase transition-colors"
                  >
                    Muat Lebih Banyak
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}



