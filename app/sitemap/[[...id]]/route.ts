// app/sitemap/[[...id]]/route.ts
import { NextResponse } from 'next/server'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'
import ramJson from '@/data/ram.json'
import storageJson from '@/data/storage.json'

// Cache and revalidate hourly instead of forcing calculation on every single request
export const revalidate = 3600

const CHUNK_SIZE = 5000

// Helper function to safely extract a clean URL slug from corrupted scraper text
function cleanScraperId(rawId: any): string {
  if (typeof rawId !== 'string') return String(rawId);
  
  // 1. Cut off the string the moment an external URL ('https') shows up
  let clean = rawId.split(/https/i)[0];
  
  // 2. Remove anything that isn't an alphanumeric character, hyphen, or space
  clean = clean.replace(/[^a-zA-Z0-9\s-]/g, '');
  
  // 3. Convert spaces to hyphens and lowercase it for SEO friendly URLs
  return clean.trim().replace(/[\s]+/g, '-').toLowerCase();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id?: string[] }> }
) {
  const { id: idArray } = await params
  const now = new Date().toISOString()

  if (!idArray || idArray.length === 0) {
    return new NextResponse('Specify a chunk index (e.g., /sitemap/0.xml)', { status: 404 })
  }

  const rawId = idArray[0]
  const sitemapId = parseInt(rawId.replace('.xml', ''), 10)

  if (isNaN(sitemapId)) {
    return new NextResponse('Invalid Sitemap ID Component', { status: 404 })
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  // ID 0: Base statics + all hardware catalog pages
  if (sitemapId === 0) {
    const staticPages = [
      { url: SITE_URL, changefreq: 'weekly', priority: '1.0' },
      { url: `${SITE_URL}/faq`, changefreq: 'monthly', priority: '0.8' },
      { url: `${SITE_URL}/games`, changefreq: 'weekly', priority: '0.8' },
      { url: `${SITE_URL}/about`, changefreq: 'yearly', priority: '0.5' },
      { url: `${SITE_URL}/privacy`, changefreq: 'yearly', priority: '0.3' },
      { url: `${SITE_URL}/terms`, changefreq: 'yearly', priority: '0.3' },
    ]

    const directoryPages = [
      { url: `${SITE_URL}/cpu`, changefreq: 'weekly', priority: '0.7' },
      { url: `${SITE_URL}/gpu`, changefreq: 'weekly', priority: '0.7' },
      { url: `${SITE_URL}/ram`, changefreq: 'monthly', priority: '0.6' },
      { url: `${SITE_URL}/storage`, changefreq: 'monthly', priority: '0.6' },
    ]

    const basePages = [...staticPages, ...directoryPages]

    basePages.forEach(page => {
      xml += `\n  <url><loc>${page.url}</loc><lastmod>${now}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>`
    })

    GPUs.forEach(gpu => {
      xml += `\n  <url><loc>${SITE_URL}/gpu/${gpu.id}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    })

    CPUs.forEach(cpu => {
      xml += `\n  <url><loc>${SITE_URL}/cpu/${cpu.id}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    })

    // RAM detail pages (With formatting safety cleanup)
    ;(ramJson as any[]).forEach((ram: any) => {
      const cleanRamId = cleanScraperId(ram.id || ram.slug || ram.model);
      xml += `\n  <url><loc>${SITE_URL}/ram/${cleanRamId}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`
    })

    // Storage detail pages (FIXED: Cleans raw text data and prevents XML blowout)
    ;(storageJson as any[]).forEach((storage: any) => {
      const cleanStorageId = cleanScraperId(storage.id || storage.slug || storage.model);
      xml += `\n  <url><loc>${SITE_URL}/storage/${cleanStorageId}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`
    })

  } else {
    // ID 1+: Build pairing chunks
    const limitedCPUs = CPUs.slice(0, 150)
    const limitedGPUs = GPUs.slice(0, 150)
    const allBuilds: { cpuId: string; gpuId: string }[] = []

    limitedCPUs.forEach(cpu => {
      limitedGPUs.forEach(gpu => {
        allBuilds.push({ cpuId: cpu.id, gpuId: gpu.id })
      })
    })

    const start = (sitemapId - 1) * CHUNK_SIZE
    const end = start + CHUNK_SIZE
    const buildChunk = allBuilds.slice(start, end)

    if (buildChunk.length === 0) {
      return new NextResponse('Sitemap Chunk Out of Bounds', { status: 404 })
    }

    buildChunk.forEach(build => {
      xml += `\n  <url><loc>${SITE_URL}/build/${build.cpuId}/${build.gpuId}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    })
  }

  xml += `\n</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
