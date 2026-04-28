import { MetadataRoute } from 'next'
import { getServices } from '@/lib/api/services'
import { getArticles } from '@/lib/api/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hutabaratlawoffice.com' // Replace with process.env.NEXT_PUBLIC_SITE_URL later

  const services = await getServices()
  const articles = await getArticles()

  const serviceUrls = services.map((service: any) => ({
    url: `${baseUrl}/layanan/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const articleUrls = articles.map((article: any) => ({
    url: `${baseUrl}/artikel/${article.slug}`,
    lastModified: new Date(article.published_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/konsultasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    ...serviceUrls,
    ...articleUrls,
  ]
}
