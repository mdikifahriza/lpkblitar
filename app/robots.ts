import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hutabaratlawoffice.com' // Replace with your actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
