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

export const generateMetadata = artMetadata;

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return <NotFound />;
  }

  if (typeof article.konten === "string") {
    article.content = article.konten
      .split("\n\n")
      .map((paragraph: string) => ({
        type: "p",
        text: paragraph.trim(),
      }))
      .filter((block: any) => block.text.length > 0);
  } else {
    article.content = [];
  }

  const [{ contact }, allArticles] = await Promise.all([getContactData(), getArticles()]);

  const relatedArticles = allArticles
    .filter((item) => item.id !== article.id && item.kategori === article.kategori)
    .slice(0, 3);

  if (relatedArticles.length < 3) {
    const fallback = allArticles.filter((item) => item.id !== article.id).slice(0, 3);
    relatedArticles.push(...fallback.slice(0, 3 - relatedArticles.length));
  }

  return (
    <ArtikelDetailClient
      article={article}
      author={getAuthorFallback()}
      relatedArticles={relatedArticles}
      whatsappNumber={contact.whatsapp_number}
    />
  );
}
