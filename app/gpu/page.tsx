// app/gpu/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { GPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'
import GpuSearchList from '@/components/gpu/GpuSearchList'

export const metadata: Metadata = {
  title: 'GPU Bottleneck Calculator — All Graphics Cards',
  description: 'Find the best CPU pairing for any GPU. Bottleneck analysis for every NVIDIA, AMD, and Intel graphics card — RTX 4090, RTX 4070, RX 7900 XTX, and more.',
  alternates: { canonical: `${SITE_URL}/gpu` },
}

export default function GpuIndexPage() {
  // Group by brand and pre-sort by benchmark score
  const nvidiaGpus = GPUs.filter(g => g.brand === 'NVIDIA').sort((a, b) => b.benchmarkScore - a.benchmarkScore)
  const amdGpus    = GPUs.filter(g => g.brand === 'AMD').sort((a, b) => b.benchmarkScore - a.benchmarkScore)
  const intelGpus  = GPUs.filter(g => g.brand === 'Intel').sort((a, b) => b.benchmarkScore - a.benchmarkScore)

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <GpuSearchList 
          initialNvidia={nvidiaGpus} 
          initialAmd={amdGpus} 
          initialIntel={intelGpus} 
        />
      </main>
      <Footer />
    </>
  )
}
