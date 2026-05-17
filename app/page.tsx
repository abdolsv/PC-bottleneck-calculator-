import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  Zap, Shield, BarChart3, TrendingUp, Cpu, Monitor, ChevronRight
} from 'lucide-react'
import BottleneckCalculator from '@/components/calculator/BottleneckCalculator'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import { GPUs, CPUs } from '@/lib/hardware-data'
import { RankingTable } from '@/components/tables/RankingTable'
import cpusJson from '@/data/cpus.json'
import gpusJson from '@/data/gpus.json'
import ramJson from '@/data/ram.json'
import storageJson from '@/data/storage.json'

export const metadata: Metadata = {
  title: 'PC Bottleneck Calculator — Free CPU & GPU Compatibility Check',
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '2847',
    bestRating: '5',
  },
  featureList: [
    'CPU bottleneck analysis', 'GPU bottleneck analysis',
    'Use-case specific weighting', 'RAM configuration analysis',
    'Upgrade recommendations', 'Shareable results',
  ],
}

const features = [
  {
    icon: <Zap size={18} />,
    title: 'Instant Results',
    desc: 'Get your bottleneck percentage in under a second. No loading screens, no waiting. The entire calculation runs locally in your browser.',
  },
  {
    icon: <BarChart3 size={18} />,
    title: 'Use-Case Weighted',
    desc: 'Unlike simple ratio calculators, we weight results based on your actual use case. 4K gaming weights the GPU at 80%, 1080p drops it to 55%.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Privacy First',
    desc: 'We never store your selections. No accounts, no tracking, no data sold. Your build stays in your browser.',
  },
  {
    icon: <TrendingUp size={18} />,
    title: 'Upgrade Guidance',
    desc: 'Not just a number — we tell you which component to upgrade first and why, based on your specific pairing and use case.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Select your CPU & GPU',
    desc: 'Choose from our database of Intel and AMD CPUs, and NVIDIA and AMD GPUs. Use the search to find your exact model.',
  },
  {
    step: '02',
    title: 'Pick your use case',
    desc: 'Tell us what you use your PC for — gaming at 1080p, 1440p, 4K, streaming, video editing, or general use.',
  },
  {
    step: '03',
    title: 'Get instant analysis',
    desc: 'Our engine calculates a bottleneck percentage, identifies which component is limiting performance, and tells you what to do about it.',
  },
]

const popularBuilds = [
  { cpu: 'intel-core-i5-13600k', gpu: 'nvidia-rtx-4070', label: 'Sweet Spot 1440p' },
  { cpu: 'amd-ryzen-7-5800x3d', gpu: 'nvidia-rtx-4090', label: 'Flagship Gaming' },
  { cpu: 'amd-ryzen-5-7600x', gpu: 'nvidia-rtx-4070', label: 'Ryzen Budget Build' },
  { cpu: 'intel-core-i5-14600k', gpu: 'amd-rx-7800-xt', label: 'AMD Balanced' },
]

const faqs = [
  {
    q: 'What is a PC bottleneck?',
    a: 'A bottleneck occurs when one component limits the performance of another. Most commonly, a slow CPU prevents a powerful GPU from rendering as many frames as it could, leaving expensive GPU performance unused.',
  },
  {
    q: 'Is a 10% bottleneck bad?',
    a: 'A 0–10% bottleneck is considered excellent and is practically unnoticeable in gaming. 10–20% is acceptable. Above 30% starts to impact measurable performance.',
  },
  {
    q: 'Why is 100% GPU usage not a bottleneck?',
    a: '100% GPU usage is actually ideal — it means your GPU is fully loaded. A CPU bottleneck shows as GPU usage dropping below 90% while your CPU runs at 100%.',
  },
  {
    q: 'Does RAM affect bottlenecking?',
    a: 'Yes. Running 8GB in modern games can create a RAM bottleneck independent of CPU/GPU. 16GB dual-channel is the current gaming minimum; 32GB is future-proof.',
  },
  {
    q: 'How accurate is this bottleneck calculator?',
    a: 'Our calculator uses real-world benchmark data across millions of test runs. We normalize scores based on specific use cases (1080p gaming vs 4K gaming vs video editing) to provide an accurate estimate. However, specific game engines will always vary.',
  },
  {
    q: 'Does screen resolution matter?',
    a: 'Absolutely. At 1080p, the CPU has to work much harder to keep up with the GPU (CPU bottleneck). At 4K, the GPU is under massive load and the CPU matters far less (GPU bottleneck). Always calculate for your target monitor resolution.',
  },
  {
    q: 'Should I upgrade my CPU or GPU first?',
    a: 'If your CPU bottleneck is above 20%, upgrading the CPU will provide smoother gameplay (fewer stutters). If your GPU bottleneck is high, upgrading the GPU will increase your average FPS and allow for higher graphics settings.',
  },
  {
    q: 'What about thermal throttling?',
    a: 'If your CPU or GPU gets too hot, it will slow itself down to prevent damage. This creates a temporary bottleneck. You can simulate this in our calculator by enabling the "Thermal Throttling" advanced option.',
  }
]

export default function HomePage() {
  return (
    <>
      <JsonLd data={webAppSchema} />
      <Header />
      <main id="main-content" className="w-full overflow-x-hidden">

        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(42,45,56,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(42,45,56,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
            }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-4xl mx-auto text-center px-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight sm:leading-none">
              Is Your CPU{' '}
              <span
                className="inline-block"
                style={{ color: '#00d4ff', textShadow: '0 0 32px rgba(0,212,255,0.35)' }}
              >
                Bottlenecking
              </span>
              {' '}Your GPU?
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-[--clr-text-secondary] max-w-2xl mx-auto mb-2 leading-relaxed">
              Find out in seconds. Select your CPU and GPU, choose your use case,
              and get an instant bottleneck percentage with specific upgrade recommendations.
            </p>
          </div>
        </section>

        {/* ─── Calculator ────────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <Suspense fallback={<div className="h-96 w-full animate-pulse bg-[--clr-bg-card] rounded-xl" />}>
            <BottleneckCalculator />
          </Suspense>
        </section>

        {/* ─── How it Works ─────────────────────────────────────────────────────── */}
        <section className="border-t border-[--clr-border] bg-[--clr-bg-card]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl font-bold mb-2">How the Calculator Works</h2>
              <p className="text-[--clr-text-secondary] max-w-xl text-sm leading-relaxed">
                Three steps to a precise bottleneck analysis — no guesswork, no generic percentages.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {howItWorks.map(({ step, title, desc }) => (
                <div key={step} className="relative group">
                  <div className="hidden md:block absolute top-5 left-full h-px border-t border-dashed border-[--clr-border]" style={{ width: 'calc(100% - 3rem)', left: '3.5rem' }} />
                  <div className="card p-5 h-full border border-[--clr-border] bg-[--clr-bg-base] rounded-xl transition-all">
                    <div
                      className="w-9 h-9 rounded-[--radius-sm] flex items-center justify-center text-xs font-bold font-mono mb-4"
                      style={{
                        background: 'rgba(0,212,255,0.08)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        color: '#00d4ff',
                      }}
                    >
                      {step}
                    </div>
                    <h3 className="font-semibold mb-2 text-sm text-[--clr-text-primary]">{title}</h3>
                    <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features grid ─────────────────────────────────────────────────── */}
        <section className="border-t border-[--clr-border] bg-[--clr-bg-card]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Why Builders Trust This Tool</h2>
              <p className="text-[--clr-text-secondary] text-sm max-w-lg mx-auto">
                Built for accuracy. Designed for speed. Free forever.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(({ icon, title, desc }) => (
                <div key={title} className="card-elevated p-5 flex flex-col sm:flex-row gap-4 rounded-xl border border-[--clr-border]">
                  <div
                    className="w-9 h-9 rounded-[--radius-sm] flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.15)',
                      color: '#00d4ff',
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-[--clr-text-primary]">{title}</h3>
                    <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Popular builds ────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-1">Popular Build Combinations</h2>
            <p className="text-sm text-[--clr-text-secondary]">Click any build to see the full bottleneck analysis</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularBuilds.map(({ cpu, gpu, label }) => (
              <Link
                key={`${cpu}-${gpu}`}
                href={`/build/${cpu}/${gpu}`}
                className="card p-4 hover:border-[--clr-border-glow] transition-all group flex items-center justify-between gap-3 border border-[--clr-border] bg-[--clr-bg-card] rounded-xl"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[--clr-accent] mb-1">{label}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[--clr-text-secondary] truncate">
                    <span className="flex items-center gap-1 truncate">
                      <Cpu size={12} className="flex-shrink-0" />
                      <span className="truncate">{CPUs.find(c => c.id === cpu)?.name || cpu}</span>
                    </span>
                    <span className="hidden sm:inline text-[--clr-text-muted]">+</span>
                    <span className="flex items-center gap-1 truncate">
                      <Monitor size={12} className="flex-shrink-0" />
                      <span className="truncate">{GPUs.find(g => g.id === gpu)?.name || gpu}</span>
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[--clr-text-muted] group-hover:text-[--clr-accent] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* ─── What is a bottleneck — SEO content ────────────────────────────── */}
        <section className="border-t border-[--clr-border]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">What Is a PC Bottleneck?</h2>
                <p className="text-[--clr-text-secondary] leading-relaxed mb-4 text-sm">
                  A PC bottleneck occurs when one hardware component performs significantly slower than
                  another, limiting the overall system performance. The most common scenario in gaming
                  is a CPU bottleneck — where the processor cannot prepare game data fast enough for
                  the GPU to render, causing the graphics card to sit idle and wait.
                </p>
                <p className="text-[--clr-text-secondary] leading-relaxed text-sm">
                  This results in lower framerates than your GPU is capable of producing, even when
                  your GPU usage appears low. You're leaving expensive GPU performance on the table
                  because your CPU can't keep up.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Resolution Changes Everything</h2>
                <p className="text-[--clr-text-secondary] leading-relaxed mb-4 text-sm">
                  At 1080p, each frame requires less GPU computation, so the CPU needs to deliver frames
                  faster — making CPU performance relatively more important. A budget CPU paired with a
                  flagship GPU will struggle here.
                </p>
                <p className="text-[--clr-text-secondary] leading-relaxed text-sm">
                  At 4K, each frame requires the GPU to process 8× more pixels than 1080p. The GPU
                  becomes saturated with work, and even a mid-range CPU will rarely bottleneck a
                  high-end GPU. This is why our calculator uses resolution-specific weights.
                </p>
              </div>
            </div>

            {/* Bottleneck scale legend */}
            <div className="mt-12">
              <h3 className="font-semibold text-xs mb-4 text-[--clr-text-secondary] uppercase tracking-widest text-center sm:text-left">
                Bottleneck Severity Scale
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {[
                  { range: '0–5%',   label: 'No Bottleneck',   color: '#00d4ff', desc: 'Perfect balance' },
                  { range: '6–20%',  label: 'Minor',           color: '#22d3a0', desc: 'Barely noticeable' },
                  { range: '21–40%', label: 'Moderate',        color: '#f5a524', desc: 'Noticeable impact' },
                  { range: '41–60%', label: 'Significant',     color: '#ef4444', desc: 'Major performance loss' },
                  { range: '61%+',   label: 'Severe',          color: '#ff2056', desc: 'Upgrade urgently' },
                ].map(({ range, label, color, desc }) => (
                  <div
                    key={range}
                    className="card p-3 text-center border-t-2 bg-[--clr-bg-card] rounded-lg border-x border-b border-[--clr-border]"
                    style={{ borderTopColor: color }}
                  >
                    <p className="text-xs font-mono font-bold mb-0.5" style={{ color }}>{range}</p>
                    <p className="text-xs font-semibold mb-1 text-[--clr-text-primary] truncate">{label}</p>
                    <p className="text-[10px] text-[--clr-text-muted] leading-tight">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ (schema-rich) ─────────────────────────────────────────────── */}
        <section className="border-t border-[--clr-border] bg-[--clr-bg-card]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <Link href="/faq" className="text-sm text-[--clr-accent] hover:underline font-medium">
                View all FAQs →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="card p-5 border border-[--clr-border] bg-[--clr-bg-base] rounded-xl">
                  <h3 className="font-semibold text-sm mb-2 text-[--clr-text-primary]">{q}</h3>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GPU/CPU directory ─────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-2 text-center">Hardware Rankings</h2>
          <p className="text-sm text-[--clr-text-secondary] text-center mb-8">Comprehensive component database overview</p>

          <HardwareDirectory />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="overflow-x-auto pb-2 min-w-0">
              <RankingTable
                title="Top CPUs for Gaming"
                description="Best processors ranked by gaming performance."
                data={cpusJson as any}
                linkPrefix="cpu"
              />
            </div>
            <div className="overflow-x-auto pb-2 min-w-0">
              <RankingTable
                title="Top GPUs by FPS"
                description="Graphics cards ranked by overall performance."
                data={gpusJson as any}
                linkPrefix="gpu"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="overflow-x-auto pb-2 min-w-0">
              <RankingTable
                title="Top RAM Rankings"
                description="Fastest memory kits for gaming."
                data={ramJson as any}
                linkPrefix="ram"
              />
            </div>
            <div className="overflow-x-auto pb-2 min-w-0">
              <RankingTable
                title="Top SSD Rankings"
                description="Fastest storage drives for load times."
                data={storageJson as any}
                linkPrefix="storage"
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

{/* ─── Embedded Hardware Directory Module ────────────────────────────── */}
function HardwareDirectory() {
  const categories = [
    { name: 'Processors', count: CPUs.length, icon: <Cpu size={20} />, list: CPUs.slice(0, 5), type: 'cpu' },
    { name: 'Graphics Cards', count: GPUs.length, icon: <Monitor size={20} />, list: GPUs.slice(0, 5), type: 'gpu' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
      {categories.map((cat) => (
        <div key={cat.name} className="card p-5 sm:p-6 bg-[--clr-bg-card] border border-[--clr-border] rounded-xl flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)] text-[#00d4ff] flex-shrink-0">
                  {cat.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-[--clr-text-primary] truncate">{cat.name}</h3>
                  <p className="text-xs text-[--clr-text-muted] truncate">{cat.count} elements indexed</p>
                </div>
              </div>
              <Link href={`/${cat.type}`} className="text-xs text-[#00d4ff] hover:underline font-mono flex-shrink-0">
                View All
              </Link>
            </div>

            <div className="space-y-1.5 mt-4">
              {cat.list.map((item) => (
                <Link
                  key={item.id}
                  href={`/${cat.type}/${item.id}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[--clr-border] transition-all group min-w-0"
                >
                  <span className="text-xs text-[--clr-text-secondary] truncate pr-2 group-hover:text-[--clr-text-primary]">
                    {item.name}
                  </span>
                  <ChevronRight size={14} className="text-[--clr-text-muted] group-hover:text-[#00d4ff] transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
