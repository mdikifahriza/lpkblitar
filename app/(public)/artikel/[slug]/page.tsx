import NotFound from "@/app/not-found";
import { getArticleBySlug, getArticles } from "@/lib/api/articles";
import { getContactData } from "@/lib/api/contact";
import { ArtikelDetailClient } from "./ArtikelDetailClient";
import { generateMetadata as artMetadata } from "./metadata";

// Helper function to get author info since it's not in the DB schema
const getAuthorFallback = () => ({
  name: "Hari Mulana Hutabarat, S.H., CPLA",
  position: "Pimpinan Kantor",
  image: "/images/principal.png",
  bio: "Praktisi hukum, konsultan finance dan perbankan, negosiator penyelesaian sengketa bisnis, serta konsultan perlindungan konsumen.",
});

type ArticleLike = {
  id?: string;
  slug?: string;
  judul?: string;
  kategori?: string;
  category?: string;
  konten?: string | null;
  content?: Array<{ type: string; text?: string; items?: string[] }>;
  thumbnail_url?: string | null;
  image?: string | null;
  published_at?: string | null;
  date?: string | null;
  estimasi_baca?: number | null;
  readTime?: string | number | null;
};

function normalizeArticleContent(article: ArticleLike) {
  if (Array.isArray(article.content) && article.content.length > 0) {
    return article.content;
  }

  if (typeof article.konten === "string") {
    return article.konten
      .split("\n\n")
      .map((paragraph) => ({
        type: "p",
        text: paragraph.trim(),
      }))
      .filter((block) => (block.text || "").length > 0);
  }

  return [];
}

function normalizeArticleForDetail(article: ArticleLike) {
  return {
    ...article,
    category: article.kategori || article.category || "Panduan Hukum",
    date: article.published_at || article.date || new Date().toISOString(),
    readTime:
      typeof article.estimasi_baca === "number"
        ? article.estimasi_baca
        : article.readTime || 5,
    image: article.thumbnail_url || article.image || "/fallback-gambar.jpeg",
    content: normalizeArticleContent(article),
  };
}

export const generateMetadata = artMetadata;

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const rawArticle = await getArticleBySlug(slug);

  if (!rawArticle) {
    return <NotFound />;
  }

  const article = normalizeArticleForDetail(rawArticle);

  const [{ contact }, allArticles] = await Promise.all([getContactData(), getArticles()]);

  const primaryPool = allArticles.filter(
    (item) => item.slug !== article.slug && item.kategori === rawArticle.kategori
  );
  const fallbackPool = allArticles.filter((item) => item.slug !== article.slug);
  const seenSlugs = new Set<string>();

  const relatedArticles = [...primaryPool, ...fallbackPool]
    .filter((item) => {
      const itemSlug = (item.slug || "").trim();

      if (!itemSlug || seenSlugs.has(itemSlug)) {
        return false;
      }

      seenSlugs.add(itemSlug);
      return true;
    })
    .slice(0, 3)
    .map((item) => normalizeArticleForDetail(item));

  return (
    <ArtikelDetailClient
      article={article}
      author={getAuthorFallback()}
      relatedArticles={relatedArticles}
      whatsappNumber={contact.whatsapp_number}
    />
  );
}
