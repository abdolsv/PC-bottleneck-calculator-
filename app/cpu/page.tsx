// app/cpu/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'
import CpuSearchList from '@/components/cpu/CpuSearchList'

export const metadata: Metadata = {
  title: 'CPU Bottleneck Calculator — All Processors',
  description: 'Find the best GPU pairing for any CPU. Bottleneck analysis for Intel and AMD processors — i5, i7, i9, Ryzen 5, 7, 9 and more.',
  alternates: { canonical: `${SITE_URL}/cpu` },
}

export default function CpuIndexPage() {
  // Sort original array data via server compute before sending downwards
  const intelCpus = CPUs.filter(c => c.brand === 'Intel').sort((a, b) => b.benchmarkScore - a.benchmarkScore)
  const amdCpus   = CPUs.filter(c => c.brand === 'AMD').sort((a, b) => b.benchmarkScore - a.benchmarkScore)

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <CpuSearchList 
          initialIntel={intelCpus} 
          initialAmd={amdCpus} 
        />
      </main>
      <Footer />
    </>
  )
}
