// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // 1. Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/faq`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/games`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/about`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/privacy`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/contact`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
  ]

  // 2. Individual Component Directory Pages
  const directoryPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/cpu`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${SITE_URL}/gpu`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${SITE_URL}/ram`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/storage`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // 3. Dynamic Individual GPU Pages
  const gpuPages: MetadataRoute.Sitemap = GPUs.map(gpu => ({
    url: `${SITE_URL}/gpu/${gpu.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // 4. Dynamic Individual CPU Pages
  const cpuPages: MetadataRoute.Sitemap = CPUs.map(cpu => ({
    url: `${SITE_URL}/cpu/${cpu.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // 5. Dynamic Build Pairings (The ultimate long-tail search index query magnet)
  // Safety Guard: Next.js standard sitemaps max out at 50,000 URLs. 
  // If your database expands over hundreds of items, slice or restrict relationships here.
  const buildPages: MetadataRoute.Sitemap = []
  
  CPUs.slice(0, 150).forEach(cpu => {
    GPUs.slice(0, 150).forEach(gpu => {
      buildPages.push({
        url: `${SITE_URL}/build/${cpu.id}/${gpu.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  })

  return [
    ...staticPages, 
    ...directoryPages, 
    ...gpuPages, 
    ...cpuPages, 
    ...buildPages
  ]
}
