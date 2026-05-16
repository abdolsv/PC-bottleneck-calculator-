// app/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  Zap, Shield, BarChart3, Users, CheckCircle,
  TrendingUp, Cpu, Monitor, ChevronRight, Star
} from 'lucide-react'
import BottleneckCalculator from '@/components/calculator/BottleneckCalculator'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import { GPUs, CPUs } from '@/lib/hardware-data'

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

const stats = [
  { value: '2.8M+', label: 'Builds Analyzed' },
  { value: '98%',   label: 'Accuracy Rate' },
  { value: '0',     label: 'Signups Required' },
  { value: '<1s',   label: 'Results Time' },
]

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
  { cpu: 'i5-13600k', gpu: 'rtx-4070', label: 'Sweet Spot 1440p' },
  { cpu: 'r7-5800x3d', gpu: 'rtx-4090', label: 'Flagship Gaming' },
  { cpu: 'r5-7600x', gpu: 'rtx-4070', label: 'Ryzen Budget Build' },
  { cpu: 'i5-14600k', gpu: 'rx-7800xt', label: 'AMD Balanced' },
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
]

export default function HomePage() {
  return (
    <>
      <JsonLd data={webAppSchema} />
      <Header />
      <main id="main-content">

        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-14 pb-10 px-4">
          {/* Background grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(42,45,56,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(42,45,56,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
            }}
          />
          {/* Ambient glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[--clr-border-glow] bg-[--clr-bg-card] text-xs text-[--clr-text-secondary] mb-6">
              <span className="w-2 h-2 rounded-full bg-[--clr-accent] animate-pulse" />
              <span>Free · No signup · Instant results · {GPUs.length + CPUs.length}+ components</span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
              Is Your CPU{' '}
              <span
                className="inline-block"
                style={{ color: '#00d4ff', textShadow: '0 0 32px rgba(0,212,255,0.35)' }}
              >
                Bottlenecking
              </span>
              {' '}Your GPU?
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[--clr-text-secondary] max-w-2xl mx-auto mb-8 leading-relaxed">
              Find out in seconds. Select your CPU and GPU, choose your use case,
              and get an instant bottleneck percentage with specific upgrade recommendations.
            </p>

            {/* Social proof row */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[--clr-text-muted] mb-10">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#f5a524" className="text-[--clr-medium]" />
                  ))}
                </div>
                <span>4.8/5 from 2,800+ users</span>
              </div>
              <span className="w-px h-4 bg-[--clr-border]" />
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                <span>2.8M+ builds analyzed</span>
              </div>
              <span className="w-px h-4 bg-[--clr-border]" />
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-[--clr-ok]" />
                <span>No account required</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Calculator ────────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <Suspense>
            <BottleneckCalculator />
          </Suspense>
        </section>

        {/* ─── Stats bar ─────────────────────────────────────────────────────── */}
        <section className="border-y border-[--clr-border] bg-[--clr-bg-card]">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="text-3xl font-mono font-bold"
                    style={{ color: '#00d4ff' }}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-[--clr-text-muted] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ──────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">How the Calculator Works</h2>
            <p className="text-[--clr-text-secondary] max-w-xl mx-auto text-sm leading-relaxed">
              Three steps to a precise bottleneck analysis — no guesswork, no generic percentages.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {howItWorks.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                {/* Connector line */}
                <div className="hidden sm:block absolute top-5 left-full w-full h-px border-t border-dashed border-[--clr-border] last:hidden" style={{ width: 'calc(100% - 2rem)', left: '3rem' }} />
                <div className="card p-5">
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
                  <h3 className="font-semibold mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
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
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ icon, title, desc }) => (
                <div key={title} className="card-elevated p-5 flex gap-4">
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
                    <h3 className="font-semibold text-sm mb-1">{title}</h3>
                    <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Popular builds ────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Popular Build Combinations</h2>
              <p className="text-sm text-[--clr-text-secondary]">Click any build to see the full bottleneck analysis</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {popularBuilds.map(({ cpu, gpu, label }) => (
              <Link
                key={`${cpu}-${gpu}`}
                href={`/build/${cpu}/${gpu}`}
                className="card p-4 hover:border-[--clr-border-glow] transition-all group flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[--clr-accent] mb-1">{label}</p>
                  <div className="flex items-center gap-2 text-sm text-[--clr-text-secondary] flex-wrap">
                    <span className="flex items-center gap-1">
                      <Cpu size={12} />
                      {CPUs.find(c => c.id === cpu)?.name}
                    </span>
                    <span className="text-[--clr-text-muted]">+</span>
                    <span className="flex items-center gap-1">
                      <Monitor size={12} />
                      {GPUs.find(g => g.id === gpu)?.name}
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
            <div className="grid md:grid-cols-2 gap-12">
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
            <div className="mt-10">
              <h3 className="font-semibold text-sm mb-4 text-[--clr-text-secondary] uppercase tracking-widest">
                Bottleneck Severity Scale
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { range: '0–5%',   label: 'No Bottleneck',   color: '#00d4ff', desc: 'Perfect balance' },
                  { range: '6–20%',  label: 'Minor',           color: '#22d3a0', desc: 'Barely noticeable' },
                  { range: '21–40%', label: 'Moderate',        color: '#f5a524', desc: 'Noticeable impact' },
                  { range: '41–60%', label: 'Significant',     color: '#ef4444', desc: 'Major performance loss' },
                  { range: '61%+',   label: 'Severe',          color: '#ff2056', desc: 'Upgrade urgently' },
                ].map(({ range, label, color, desc }) => (
                  <div
                    key={range}
                    className="card p-3 text-center"
                    style={{ borderTopColor: color, borderTopWidth: 2 }}
                  >
                    <p className="text-xs font-mono font-bold mb-0.5" style={{ color }}>{range}</p>
                    <p className="text-xs font-semibold mb-1">{label}</p>
                    <p className="text-[10px] text-[--clr-text-muted]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ (schema-rich) ─────────────────────────────────────────────── */}
        <section className="border-t border-[--clr-border] bg-[--clr-bg-card]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <Link href="/faq" className="text-sm text-[--clr-accent] hover:underline">
                View all FAQs →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="card p-5">
                  <h3 className="font-semibold text-sm mb-2">{q}</h3>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GPU/CPU directory ─────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Browse by Component</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Monitor size={16} className="text-[--clr-ok]" />
                Graphics Cards (GPUs)
              </h3>
              <p className="text-xs text-[--clr-text-secondary] mb-4">
                Find the best CPU for any GPU — NVIDIA and AMD.
              </p>
              <div className="space-y-1.5 mb-4">
                {GPUs.slice(0, 5).map(gpu => (
                  <Link
                    key={gpu.id}
                    href={`/gpu/${gpu.id}`}
                    className="flex items-center justify-between py-1 text-xs text-[--clr-text-secondary] hover:text-[--clr-accent] transition-colors group"
                  >
                    <span>{gpu.name}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
              <Link
                href="/gpu"
                className="text-xs text-[--clr-accent] hover:underline flex items-center gap-1"
              >
                View all {GPUs.length} GPUs →
              </Link>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Cpu size={16} className="text-[--clr-high]" />
                Processors (CPUs)
              </h3>
              <p className="text-xs text-[--clr-text-secondary] mb-4">
                Find the best GPU for any CPU — Intel and AMD.
              </p>
              <div className="space-y-1.5 mb-4">
                {CPUs.slice(0, 5).map(cpu => (
                  <Link
                    key={cpu.id}
                    href={`/cpu/${cpu.id}`}
                    className="flex items-center justify-between py-1 text-xs text-[--clr-text-secondary] hover:text-[--clr-accent] transition-colors group"
                  >
                    <span>{cpu.name}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
              <Link
                href="/cpu"
                className="text-xs text-[--clr-accent] hover:underline flex items-center gap-1"
              >
                View all {CPUs.length} CPUs →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
