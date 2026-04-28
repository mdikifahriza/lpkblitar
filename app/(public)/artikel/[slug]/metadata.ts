import { getArticleBySlug, getArticles } from "@/lib/api/articles";
import { getSiteSettings } from "@/lib/api/settings";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const settings = await getSiteSettings();

  if (!article) {
    return {
      title: `Artikel Tidak Ditemukan | ${settings.site_name}`
    };
  }

  // extract excerpt from content if it's text
  let description = article.judul;
  if (typeof article.konten === 'string') {
    description = article.konten.substring(0, 160) + '...';
  } else if (Array.isArray(article.konten) && article.konten[0]) {
    description = article.konten[0].text?.substring(0, 160) + '...';
  }

  return {
    title: `${article.judul} | ${settings.site_name}`,
    description: description,
    openGraph: {
      title: article.judul,
      description: description,
      images: [
        {
          url: article.thumbnail_url || (settings as any).og_image_default_url,
          width: 1200,
          height: 630,
          alt: article.judul,
        },
      ],
      type: "article",
      publishedTime: article.published_at,
    },
  };
}

