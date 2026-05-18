import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_URL } from '@/lib/constants'
import { Storages } from '@/lib/hardware-data'
import StorageSearchList from '@/components/storage/StorageSearchList'

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear()
  
  return {
    title: `SSD Benchmark Rankings — Best Storage Drives ${currentYear}`,
    description: `Compare NVMe SSDs and SATA drives by benchmark score. Find the fastest storage for gaming load times, content creation, and everyday use. Free rankings from real-world data.`,
    alternates: { canonical: `${SITE_URL}/storage` },
  }
}

export default function StorageIndexPage() {
  const sorted = [...Storages].sort((a, b) => b.score - a.score)
  
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <StorageSearchList initialItems={sorted} />
      </main>
      <Footer />
    </>
  )
}
