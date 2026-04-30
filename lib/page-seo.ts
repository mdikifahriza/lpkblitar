import type { Metadata } from "next";
import { getPageSeo, getSiteSettings } from "@/lib/api/settings";

type StaticPageMetadataOptions = {
  path: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

function cleanText(value?: string | null) {
  return value?.trim() || "";
}

export async function buildStaticPageMetadata({
  path,
  fallbackTitle,
  fallbackDescription,
}: StaticPageMetadataOptions): Promise<Metadata> {
  const [settings, pageSeo] = await Promise.all([getSiteSettings(), getPageSeo(path)]);

  const resolvedSeoTitle = cleanText(pageSeo?.title);
  const resolvedFallbackTitle = cleanText(fallbackTitle);
  const resolvedDescription =
    cleanText(pageSeo?.description) ||
    cleanText(fallbackDescription) ||
    cleanText(settings.site_description);
  const resolvedOpenGraphTitle =
    cleanText(pageSeo?.og_title) ||
    resolvedSeoTitle ||
    resolvedFallbackTitle ||
    cleanText(settings.tab_title) ||
    cleanText(settings.site_name);
  const resolvedOpenGraphDescription =
    cleanText(pageSeo?.og_description) || resolvedDescription;
  const resolvedOpenGraphImage =
    cleanText(pageSeo?.og_image_url) ||
    cleanText(settings.og_image_default_url) ||
    "/images/hero-portrait.png";

  return {
    title: resolvedSeoTitle
      ? { absolute: resolvedSeoTitle }
      : resolvedFallbackTitle || { absolute: cleanText(settings.tab_title) || cleanText(settings.site_name) },
    description: resolvedDescription,
    openGraph: {
      title: resolvedOpenGraphTitle,
      description: resolvedOpenGraphDescription,
      images: [
        {
          url: resolvedOpenGraphImage,
          width: 1200,
          height: 630,
          alt: resolvedOpenGraphTitle || cleanText(settings.site_name),
        },
      ],
      type: "website",
      locale: "id_ID",
    },
    robots: pageSeo?.no_index
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : undefined,
  };
}
