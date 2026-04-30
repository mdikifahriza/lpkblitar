"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface ArticleProps {
  id: string;
  slug: string;
  judul: string;
  kategori: string;
  thumbnail_url: string;
  published_at: string;
  estimasi_baca: number;
}

interface ArtikelSectionProps {
  articles: ArticleProps[];
}

export function Artikel({ articles }: ArtikelSectionProps) {
  // Hanya ambil 3 artikel terbaru
  const latestArticles = articles.slice(0, 3);

  return (
    <section id="artikel" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
              Insight & Publikasi
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight">
              Edukasi Hukum untuk Bisnis & Konsumen
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/artikel" passHref>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-8 py-6 h-auto tracking-wider text-sm font-medium uppercase"
              >
                Lihat Semua Artikel
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-card border border-border flex flex-col h-full overflow-hidden"
            >
              <Link href={`/artikel/${article.slug}`} className="flex flex-col h-full">
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-card/80 backdrop-blur-sm border border-border text-xs font-medium text-foreground uppercase tracking-wider">
                      {article.kategori.replace("-", " ")}
                    </span>
                  </div>
                  <SafeImage
                    src={article.thumbnail_url}
                    alt={article.judul}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(article.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{article.estimasi_baca} min read</span>
                  </div>

                  <h3 className="font-serif text-2xl text-foreground font-bold mb-4 line-clamp-3 group-hover:text-primary transition-colors">
                    {article.judul}
                  </h3>

                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-primary font-medium text-sm uppercase tracking-wider">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}





