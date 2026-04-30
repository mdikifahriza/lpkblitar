import { getArticleBySlug } from "@/lib/api/articles";
import { getSiteSettings } from "@/lib/api/settings";
import { buildSeoExcerpt } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const settings = await getSiteSettings();

  if (!article) {
    return {
      title: {
        absolute: `Artikel Tidak Ditemukan | ${settings.site_name}`,
      },
    };
  }

  const title = `${article.judul} | ${settings.site_name}`;
  const description = buildSeoExcerpt(article.konten || article.judul);
  const ogImageUrl = article.thumbnail_url || settings.og_image_default_url || "/images/hero-portrait.png";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/artikel/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
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
