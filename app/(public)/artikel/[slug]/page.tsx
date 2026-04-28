import { getArticleBySlug, getArticles } from "@/lib/api/articles";
import { ArtikelDetailClient } from "./ArtikelDetailClient";
import NotFound from "@/app/not-found";

// Helper function to get author info since it's not in the DB schema
const getAuthorFallback = () => ({
  name: "Hari Mulana Hutabarat, S.H., CPLA",
  position: "Pimpinan Kantor",
  image: "/images/principal.png",
  bio: "Praktisi hukum, konsultan finance dan perbankan, negosiator penyelesaian sengketa bisnis, serta konsultan perlindungan konsumen."
});

import { generateMetadata as artMetadata } from './metadata';
export const generateMetadata = artMetadata;

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return <NotFound />;
  }

  // Parse markdown/rich text content into blocks if it's a string, or create a simple paragraph block
  if (typeof article.konten === 'string') {
    article.content = article.konten.split('\n\n').map((p: string) => ({
      type: "p",
      text: p.trim()
    })).filter((b: any) => b.text.length > 0);
  } else {
    article.content = [];
  }

  const allArticles = await getArticles();
  const relatedArticles = allArticles
    .filter((a: any) => a.id !== article.id && a.kategori === article.kategori)
    .slice(0, 3);
    
  if (relatedArticles.length < 3) {
      const fallback = allArticles.filter((a: any) => a.id !== article.id).slice(0, 3);
      relatedArticles.push(...fallback.slice(0, 3 - relatedArticles.length));
  }

  return <ArtikelDetailClient article={article} author={getAuthorFallback()} relatedArticles={relatedArticles} />;
}

