import { createClient } from "@/lib/supabase/server";
import { ARTICLES } from "@/lib/data";

export async function getArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.warn("⚠️ Using fallback data because Supabase articles table is missing or errored:", error.message);
    return ARTICLES.map(a => ({
      id: a.slug,
      slug: a.slug,
      judul: a.title,
      kategori: a.category,
      thumbnail_url: a.image,
      published_at: a.date,
      estimasi_baca: parseInt(a.readTime) || 5,
      konten: typeof a.content === 'string' ? a.content : a.content?.map((c: any) => c.text).join('\n\n'),
      featured: a.featured
    }));
  }

  return data || [];
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    const fallback = ARTICLES.find(a => a.slug === slug);
    if (fallback) {
      return {
        id: fallback.slug,
        slug: fallback.slug,
        judul: fallback.title,
        kategori: fallback.category,
        thumbnail_url: fallback.image,
        published_at: fallback.date,
        estimasi_baca: parseInt(fallback.readTime) || 5,
        konten: typeof fallback.content === 'string' ? fallback.content : fallback.content?.map((c: any) => c.text).join('\n\n'),
        featured: fallback.featured
      };
    }
    return null;
  }

  return data;
}
