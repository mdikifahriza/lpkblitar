"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Share2,
  Link as LinkIcon,
  Check,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ARTICLES,
  ARTICLE_AUTHORS,
  type Article,
  type ArticleBlock,
} from "@/lib/data";
import NotFound from "@/app/not-found";

const WHATSAPP_NUMBER = "6281234567890";

function buildWhatsAppHref(article: any) {
  const message = `Halo, saya sudah membaca artikel "${article.judul}" dan ingin berkonsultasi lebih lanjut.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Function to render different block types
function renderBlock(block: any, idx: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={idx} className="mb-6 leading-relaxed">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          key={idx}
          className="text-2xl font-serif font-bold text-foreground mt-12 mb-4"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={idx}
          className="text-xl font-serif font-bold text-foreground mt-8 mb-3"
        >
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <blockquote
          key={idx}
          className="border-l-4 border-primary pl-6 py-2 my-8 text-xl font-serif italic text-foreground/90 bg-primary/5 rounded-r-lg"
        >
          "{block.text}"
        </blockquote>
      );
    case "list":
      return (
        <ul key={idx} className="list-disc list-inside space-y-2 mb-6 ml-4">
          {block.items?.map((item: any, i: number) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}


export function ArtikelDetailClient({ article, author, relatedArticles }: { article: any, author: any, relatedArticles: any[] }) {
  
  const [isCopied, setIsCopied] = useState(false);

  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.slug]);

  if (!article) {
    return <NotFound />;
  }

  // Get related articles (excluding current one, same category, max 3)
  

  // Fallback if no related in same category
  const fallbackArticles = useMemo(() => {
    return ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  }, [article.slug]);

  
    

  

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 noise-bg bg-background border-b border-border relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/artikel"
              className="hover:text-primary transition-colors"
            >
              Insight Hukum
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground max-w-[200px] truncate">
              {article.judul}
            </span>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-6">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8">
              {article.judul}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(article.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {article.readTime} mnt baca
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {author.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden aspect-[21/9] bg-secondary border border-border shadow-2xl">
          <SafeImage
            src={article.image}
            alt={article.judul}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Left Column - Article Content */}
            <div className="lg:w-2/3">
              <article className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                {article.content.map((block: any, idx: number) =>
                  renderBlock(block, idx),
                )}
              </article>

              {/* Share Options */}
              <div className="mt-12 pt-8 border-t border-border flex items-center gap-4">
                <span className="font-medium text-foreground">Bagikan:</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border hover:border-primary hover:text-primary"
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const title = encodeURIComponent(article.judul);
                    window.open(
                      `https://wa.me/?text=${title}%20${url}`,
                      "_blank",
                    );
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border hover:border-primary hover:text-primary"
                  onClick={handleCopyLink}
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <LinkIcon className="w-4 h-4" />
                  )}
                </Button>
                {isCopied && (
                  <span className="text-xs text-green-500 ml-2">
                    Tautan disalin!
                  </span>
                )}
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 space-y-8">
                {/* Author Card */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <SafeImage
                      src={author.image}
                      alt={author.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    />
                    <div>
                      <h3 className="font-bold text-foreground">
                        {author.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {author.position}
                      </p>
                    </div>
                  </div>
                  
                  <Link href="/tim" passHref>
                    <Button
                      variant="link"
                      className="mt-4 p-0 h-auto text-primary hover:text-primary/80 flex items-center gap-2"
                    >
                      Lihat Profil Lengkap <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>

                {/* Consultation CTA */}
                <div className="bg-secondary rounded-xl p-8 border border-border">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    Punya Masalah Serupa?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Jangan ambil risiko mengambil keputusan hukum tanpa
                    didampingi ahlinya.
                  </p>
                  <a
                    href={buildWhatsAppHref(article)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Konsultasi Sekarang
                  </a>
                </div>

                {/* Tags / Topics (Dummy) */}
                <div>
                  <h3 className="font-bold text-foreground mb-4">Topik</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Hukum Bisnis", "Gugatan", "Mediasi", "Konsumen"].map(
                      (tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-secondary text-muted-foreground text-xs rounded-full border border-border"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 md:py-24 bg-secondary/50 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold">
                Artikel Terkait
              </h2>
            </div>
            <Link href="/artikel" passHref>
              <Button variant="ghost" className="hidden sm:flex gap-2">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((relArticle, idx) => (
              <motion.div
                key={relArticle.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-foreground">
                      {relArticle.category}
                    </span>
                  </div>
                  <SafeImage
                    src={relArticle.image}
                    alt={relArticle.judul}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-muted-foreground mb-3 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(relArticle.date).toLocaleDateString(
                        "id-ID",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {relArticle.judul}
                  </h3>
                  <Link href={`/artikel/${relArticle.slug}`} passHref>
                    <div className="mt-auto text-primary text-sm font-medium flex items-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      </div>
  );
}















