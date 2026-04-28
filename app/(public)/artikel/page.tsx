import { getArticles } from "@/lib/api/articles";
import { ArtikelClient } from "./ArtikelClient";

export default async function ArtikelPage() {
  const articles = await getArticles();
  return <ArtikelClient initialArticles={articles} />;
}
