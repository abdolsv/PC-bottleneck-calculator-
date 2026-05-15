// app/faq/page.tsx
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'PC Bottleneck FAQ — Common Questions Answered',
  description: 'Answers to the most common questions about PC bottlenecking, CPU vs GPU balance, and upgrade decisions.',
}

const faqs = [
  {
    q: 'What percentage bottleneck is acceptable?',
    a: 'A bottleneck of 0–10% is excellent and practically unnoticeable. 10–20% is acceptable. Above 20% starts to impact performance noticeably. Above 40% means you\'re significantly underusing your more powerful component.',
  },
  {
    q: 'Does RAM affect bottlenecking?',
    a: 'Yes. Running less than 16GB in modern games can create a RAM bottleneck independent of your CPU and GPU. For gaming, 16GB dual-channel is the current minimum, and 32GB is becoming the sweet spot for future-proofing.',
  },
  {
    q: 'Is 100% GPU usage a bottleneck?',
    a: 'No — 100% GPU usage is actually ideal for gaming. It means your GPU is working at maximum capacity. A CPU bottleneck shows as your GPU usage dropping below 90% while your CPU runs near 100%.',
  },
  {
    q: 'Why does resolution affect bottlenecking?',
    a: 'At 1080p, each frame takes less GPU work, so the CPU needs to deliver frames faster, making it relatively more important. At 4K, each frame requires massive GPU work, so the GPU becomes the clear bottleneck most of the time.',
  },
  {
    q: 'Can I fix a bottleneck without upgrading hardware?',
    a: 'Partially. Overclocking your CPU can reduce a CPU bottleneck. Lowering in-game settings that stress the CPU (draw distance, NPCs) can help. For a GPU bottleneck, raising resolution or quality settings actually helps by giving your GPU more to do.',
  },
  {
    q: 'How accurate is this bottleneck calculator?',
    a: 'Our calculator uses normalized benchmark scores and use-case weighted formulas to estimate bottleneck percentage. Real-world results vary by specific game, driver version, and system configuration. Use this as a directional guide, not an absolute number.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
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
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-[--clr-text-secondary] mb-10">
          Everything you need to know about PC bottlenecking.
        </p>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-6">
              <h2 className="font-semibold text-lg mb-2">{faq.q}</h2>
              <p className="text-[--clr-text-secondary] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
