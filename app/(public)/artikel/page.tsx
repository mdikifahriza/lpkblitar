import { getArticles } from "@/lib/api/articles";
import { buildStaticPageMetadata } from "@/lib/page-seo";
import { ArtikelClient } from "./ArtikelClient";

export async function generateMetadata() {
  return buildStaticPageMetadata({
    path: "/artikel",
    fallbackTitle: "Artikel",
    fallbackDescription:
      "Baca artikel hukum seputar sengketa finance, perlindungan konsumen, mediasi bisnis, dan panduan hukum untuk pelaku usaha.",
  });
}

export default async function ArtikelPage() {
  const articles = await getArticles();
  return <ArtikelClient initialArticles={articles} />;
}
