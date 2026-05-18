// app/ram/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_URL } from '@/lib/constants'
import ramJson from '@/data/ram.json'
import RamSearchList from '@/components/ram/RamSearchList'

const year = new Date().getFullYear()

export const metadata: Metadata = {
  title: `RAM Benchmark Rankings — Best Memory Kits ${year} | PC Bottleneck Calculator`,
  description: `Compare DDR4 and DDR5 memory kits by benchmark score in ${year}. Find the fastest RAM for gaming, content creation, and productivity. Free performance rankings from real-world tests across thousands of benchmark submissions.`,
  alternates: { canonical: `${SITE_URL}/ram` },
  keywords: [
    `best RAM ${year}`,
    'DDR5 benchmark rankings',
    'DDR4 vs DDR5',
    'fastest gaming RAM',
    'memory kit comparison',
    'RAM benchmark score',
    'PC bottleneck RAM',
    'XMP EXPO RAM ranking',
  ],
}

export default function RamIndexPage() {
  const sorted = [...(ramJson as any[])].sort((a, b) => b.score - a.score)
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <RamSearchList initialItems={sorted} />
      </main>
      <Footer />
    </>
  )
}
