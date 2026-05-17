// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server' // 👈 FIX THIS IMPORT
import { CPUs, GPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'
const CHUNK_SIZE = 5000

export async function GET() {
  const totalBuilds = Math.min(CPUs.length, 150) * Math.min(GPUs.length, 150)
  const numberOfChunks = Math.ceil(totalBuilds / CHUNK_SIZE)
  
  const totalSitemaps = numberOfChunks + 1

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  
  for (let i = 0; i < totalSitemaps; i++) {
    xml += `
    <sitemap>
      <loc>${SITE_URL}/sitemap/${i}.xml</loc>
    </sitemap>`
  }
  
  xml += `\n</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
