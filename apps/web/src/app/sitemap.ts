import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clipforge-ai.com'
  
  // Get current date for lastModified
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  
  return [
    // Homepage - highest priority, changes frequently
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    
    // Core marketing pages - high priority
    {
      url: `${baseUrl}/features`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Secondary marketing pages
    {
      url: `${baseUrl}/affiliate`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    // Legal and support pages - lower priority
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    
    // Auth pages - exclude sensitive pages like /dashboard, /admin, /api
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]
}
