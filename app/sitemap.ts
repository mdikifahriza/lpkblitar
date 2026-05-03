import { MetadataRoute } from "next";
import { getArticles } from "@/lib/api/articles";
import { getPublicGalleries } from "@/lib/api/galleries";
import { getServices } from "@/lib/api/services";
import { getTeamMembers } from "@/lib/api/team";
import { getSiteUrl } from "@/lib/site";

type SitemapService = {
  slug: string;
};

type SitemapArticle = {
  slug: string;
  published_at?: string | null;
};

type SitemapGallery = {
  slug: string;
  updated_at?: string | null;
};

type SitemapTeamMember = {
  slug: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const services = (await getServices()) as SitemapService[];
  const teamMembers = (await getTeamMembers()) as SitemapTeamMember[];
  const articles = (await getArticles()) as SitemapArticle[];
  const { galleries } = await getPublicGalleries();
  const galleryEntries = galleries as SitemapGallery[];

  const serviceUrls = services.map((service) => ({
    url: `${baseUrl}/layanan/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/artikel/${article.slug}`,
    lastModified: new Date(article.published_at || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const galleryUrls = galleryEntries.map((gallery) => ({
    url: `${baseUrl}/galeri/${gallery.slug}`,
    lastModified: new Date(gallery.updated_at || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const teamDetailUrls = teamMembers.map((member) => ({
    url: `${baseUrl}/tim/${member.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeri`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/konsultasi`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    ...serviceUrls,
    ...teamDetailUrls,
    ...articleUrls,
    ...galleryUrls,
  ];
}
