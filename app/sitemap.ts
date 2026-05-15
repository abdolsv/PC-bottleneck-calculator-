// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/faq`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/about`,lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]

  // Dynamic GPU comparison pages — goldmine for long-tail SEO
  const gpuPages: MetadataRoute.Sitemap = GPUs.map(gpu => ({
    url: `${SITE_URL}/gpu/${gpu.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic CPU pages
  const cpuPages: MetadataRoute.Sitemap = CPUs.map(cpu => ({
    url: `${SITE_URL}/cpu/${cpu.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...gpuPages, ...cpuPages]
}
