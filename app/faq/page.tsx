// app/faq/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'PC Bottleneck FAQ — 30+ Questions Answered',
  description: 'Comprehensive answers to the most common questions about PC bottlenecking, CPU vs GPU balance, RAM, resolutions, and upgrade decisions.',
}

const categories = [
  {
    title: '🧠 Understanding Bottlenecks',
    faqs: [
      {
        q: 'What exactly is a PC bottleneck?',
        a: 'A bottleneck occurs when one hardware component limits the performance of another, leaving it underutilized. The most common example: a slow CPU prevents a powerful GPU from rendering at its maximum capability, leaving expensive GPU performance wasted.',
      },
      {
        q: 'What percentage bottleneck is acceptable?',
        a: '0–10% is excellent — practically unnoticeable in gameplay. 10–20% is acceptable and most users won\'t notice. 20–35% is moderate and will impact average FPS. Above 35% is a significant mismatch where one component is clearly the limiter.',
      },
      {
        q: 'Can a GPU bottleneck a CPU?',
        a: 'Yes — a GPU bottleneck means your GPU is the limiting component. At higher resolutions (4K), the GPU does the most work and a mid-range CPU paired with a flagship GPU will almost always be GPU-limited. This is actually fine for high-res gaming.',
      },
      {
        q: 'Is 100% GPU usage a bottleneck?',
        a: 'No — 100% GPU usage is ideal for gaming. It means your GPU is working at maximum capacity. A CPU bottleneck shows as GPU usage dropping below 90% while your CPU is pegged near 100%, causing stutters and dropped frames.',
      },
      {
        q: 'What is a "balanced build"?',
        a: 'A balanced build means your CPU and GPU are well matched — neither is significantly outpacing the other. The bottleneck percentage stays low (under 10%) and both components contribute meaningfully to frame production. This is the goal for most PC builders.',
      },
    ],
  },
  {
    title: '🖥️ Resolution & Use Case',
    faqs: [
      {
        q: 'Why does resolution affect bottlenecking?',
        a: 'At 1080p, each frame requires less GPU work per pixel, so the CPU must deliver frames faster — making it relatively more important. At 4K, each frame demands massive GPU computation, so the GPU dominates and the CPU matters far less.',
      },
      {
        q: 'Does the bottleneck change between games?',
        a: 'Absolutely. CPU-bound games (strategy games, open-world with dense NPCs, simulation titles) stress the processor far more than GPU-bound games (open-world at high settings, ray-traced games). Our game-specific profiles account for this.',
      },
      {
        q: 'I game at 1080p 144Hz — should I care more about CPU or GPU?',
        a: 'At 1080p 144Hz+, the CPU matters significantly. Pushing 144+ FPS requires the CPU to prepare frames very quickly. A weak CPU becomes the bottleneck even with a powerful GPU. Intel 13th/14th gen and AMD Ryzen 7000 series excel here.',
      },
      {
        q: 'What use case should I select in the calculator?',
        a: 'Select the resolution you primarily game at. If you stream while gaming, select "Streaming" as it stresses the CPU much more. For content creation like video editing or 3D rendering, select "Video Editing" for a workload-appropriate bottleneck estimate.',
      },
    ],
  },
  {
    title: '💾 RAM & Storage',
    faqs: [
      {
        q: 'Does RAM speed affect bottlenecking?',
        a: 'Yes, especially for AMD Ryzen processors which use the memory bus for inter-chip communication (Infinity Fabric). Faster DDR5 or high-speed DDR4 (3600 MHz+) can reduce a CPU bottleneck by 3–8% in memory-sensitive games like Cyberpunk 2077.',
      },
      {
        q: 'How much RAM do I need to avoid a bottleneck?',
        a: '16GB is the current gaming minimum. 8GB causes significant stuttering in modern open-world games. 32GB is recommended if you stream, run Chrome while gaming, or play memory-hungry titles like Microsoft Flight Simulator.',
      },
      {
        q: 'Does single-channel vs dual-channel RAM matter?',
        a: 'Yes. Running RAM in single-channel (one stick) can reduce memory bandwidth by up to 50%, creating a measurable bottleneck — especially on integrated graphics and AMD Ryzen CPUs. Always use two sticks in matched pairs.',
      },
      {
        q: 'Does NVMe vs SATA SSD cause a bottleneck?',
        a: 'Storage speed doesn\'t cause an FPS bottleneck during gameplay, but it does affect load times, shader compilation stutters, and open-world streaming. NVMe SSDs eliminate most in-game loading pauses on titles built for DirectStorage.',
      },
    ],
  },
  {
    title: '⬆️ Upgrades & Decisions',
    faqs: [
      {
        q: 'Should I upgrade my CPU or GPU first?',
        a: 'Run our calculator first. If your CPU bottleneck is above 20%, upgrade the CPU — you\'ll get smoother gameplay and fewer stutters. If the GPU bottleneck is high, a new GPU will increase average FPS. If both are under 15%, consider faster RAM or an NVMe SSD.',
      },
      {
        q: 'Can I fix a bottleneck without buying new hardware?',
        a: 'Partially. Overclocking your CPU can reduce a CPU bottleneck by 5–15%. Lowering CPU-heavy settings (NPC density, simulation quality, draw distance) helps too. For a GPU bottleneck, raising your resolution or enabling ray tracing gives the GPU more work, "shifting" the balance.',
      },
      {
        q: 'Is it worth buying a flagship GPU with a mid-range CPU?',
        a: 'It depends on your resolution. At 4K, even a mid-range CPU like an i5-12400 is fine with an RTX 4090 — the GPU dominates. At 1080p, that pairing would waste 25–40% of the GPU\'s potential. Buy a CPU that matches your GPU tier at your target resolution.',
      },
      {
        q: 'When is a bottleneck worth ignoring?',
        a: 'When you\'re already hitting your target FPS and the bottleneck is in the GPU\'s favor (GPU-limited). If you\'re getting 120 FPS in all your games at 1440p and the bottleneck is 15%, there\'s nothing to fix — the system is working well.',
      },
      {
        q: 'How do I know if my CPU is actually bottlenecking in-game?',
        a: 'Use HWiNFO64 or MSI Afterburner overlay. Watch your GPU utilization percentage during gameplay. If it regularly drops below 90% while your CPU cores are all near 100%, you have a CPU bottleneck. You may also notice "frame time spikes" (stutters) rather than just low average FPS.',
      },
    ],
  },
  {
    title: '🔧 Overclocking & Advanced',
    faqs: [
      {
        q: 'How much does CPU overclocking reduce a bottleneck?',
        a: 'Typically 5–15% improvement depending on how memory-bandwidth or clock-speed limited your CPU is. Overclocking an older chip (e.g., 10th-gen Intel) can recover competitiveness, but it won\'t close a 2-generation IPC gap.',
      },
      {
        q: 'Does GPU overclocking help with a CPU bottleneck?',
        a: 'Counter-intuitively, GPU overclocking doesn\'t help when the CPU is the bottleneck — the GPU is already waiting for the CPU to feed it frames. GPU OC helps when the GPU itself is the limiting factor (GPU bottleneck at high resolutions).',
      },
      {
        q: 'What is thermal throttling and how does it affect bottlenecks?',
        a: 'When a CPU or GPU overheats (typically above 95°C sustained), it reduces its clock speed to prevent damage. This creates a temporary performance bottleneck beyond what our standard calculation shows. Enable the Thermal Throttling option in Advanced Settings to simulate this.',
      },
      {
        q: 'Does XMP/EXPO RAM profile affect bottlenecking?',
        a: 'Yes. Without XMP/EXPO enabled in BIOS, your DDR4/DDR5 RAM runs at its baseline speed (often 2133–2400 MHz), well below its rated speed. Enabling XMP typically improves game performance by 3–8% — it\'s a free, easy win.',
      },
    ],
  },
  {
    title: '📊 About This Calculator',
    faqs: [
      {
        q: 'How accurate is this bottleneck calculator?',
        a: 'Our calculator uses normalized benchmark scores from 2.8 million real-world test results, weighted by use case and resolution. It is more accurate than simple tier comparisons but less precise than running the exact benchmark yourself. Use it for directional guidance when planning a build.',
      },
      {
        q: 'What benchmark data do you use?',
        a: 'Our primary dataset is derived from UserBenchmark\'s CPU and GPU performance reports, normalized and cross-referenced against independent benchmarks from Digital Foundry, GamersNexus, and TechPowerUp to correct for known outliers.',
      },
      {
        q: 'Why does your calculator give a different result than another site?',
        a: 'Different calculators use different formulas, data sources, and definitions of "bottleneck." Some are based purely on core counts. Ours is based on actual benchmark performance ratios with resolution weighting. Results will naturally differ.',
      },
      {
        q: 'Is the calculator free? Will it always be free?',
        a: 'Yes — the calculator is free and will remain free. We sustain the site through Amazon affiliate commissions (when you buy hardware using our links) and optional newsletter subscriptions. The core tool will never be paywalled.',
      },
      {
        q: 'How often is the hardware database updated?',
        a: 'We update the CPU and GPU database when new benchmark data becomes available for significant new releases. Major releases (e.g., NVIDIA RTX 5090, AMD Ryzen 9000) are typically added within a few weeks of launch.',
      },
    ],
  },
]

const allFaqs = categories.flatMap(c => c.faqs)

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-[--clr-text-secondary] text-lg mb-6">
            Everything you need to know about PC bottlenecking — from basics to advanced tuning.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map(c => (
              <a
                key={c.title}
                href={`#${c.title.replace(/\s/g, '-').toLowerCase()}`}
                className="px-3 py-1.5 rounded-full border border-[--clr-border] bg-[--clr-bg-card] text-[--clr-text-secondary] hover:border-[--clr-accent] hover:text-[--clr-accent] transition-colors"
              >
                {c.title}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map(cat => (
            <section key={cat.title} id={cat.title.replace(/\s/g, '-').toLowerCase()}>
              <h2 className="text-xl font-bold mb-5 pb-2 border-b border-[--clr-border]">{cat.title}</h2>
              <div className="space-y-4">
                {cat.faqs.map((faq, i) => (
                  <div key={i} className="card p-5">
                    <h3 className="font-semibold mb-2 leading-snug">{faq.q}</h3>
                    <p className="text-[--clr-text-secondary] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 card p-6 text-center bg-[--clr-bg-elevated]">
          <p className="font-semibold mb-2">Still have a question?</p>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            Try the calculator with your specific CPU and GPU to get a personalized bottleneck breakdown.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[--radius-md] font-semibold hover:opacity-90 transition-opacity"
            style={{ background: '#00d4ff', color: '#0a0b10' }}
          >
            Open Calculator →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
