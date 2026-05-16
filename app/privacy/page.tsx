// app/privacy/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${SITE_NAME}. We respect your privacy and collect minimal data.`,
  robots: { index: false, follow: false }, // don't index legal pages
}

const sections = [
  {
    title: 'What Data We Collect',
    content: [
      'Vercel Analytics: anonymous page view counts, referrer URLs, and browser type. No personal data.',
      'Cloudflare: IP addresses are processed in memory for DDoS protection and are never stored by us.',
      'Email list (if you opt in): your email address only. Used solely for product update announcements.',
      'Affiliate clicks: we log which affiliate links are clicked in aggregate (not tied to you individually).',
    ],
  },
  {
    title: 'What We Do NOT Collect',
    content: [
      'We do not collect your name, address, or any personally identifiable information.',
      'We do not store your CPU/GPU selections — all calculator logic runs in your browser.',
      'We do not use advertising tracking cookies (e.g., Facebook Pixel, Google retargeting).',
      'We do not sell your data to third parties.',
    ],
  },
  {
    title: 'Cookies',
    content: [
      'We use one functional cookie: "ab" — a random A or B label for A/B testing page layouts. It expires in 24 hours.',
      'If you opt into the email list, a session cookie manages the signup form state.',
      'No advertising cookies are used.',
    ],
  },
  {
    title: 'Affiliate Links',
    content: [
      'Some links on this site are affiliate links to Amazon, Newegg, and B&H Photo.',
      'When you click an affiliate link and make a purchase, we earn a small commission at no extra cost to you.',
      'Affiliate links are always labeled with "→" and disclosed in the footer.',
      'We only recommend products we believe are genuinely good value.',
    ],
  },
  {
    title: 'Third-Party Services',
    content: [
      'Vercel (hosting): subject to Vercel\'s privacy policy at vercel.com/legal/privacy-policy',
      'Cloudflare (CDN/security): subject to Cloudflare\'s privacy policy at cloudflare.com/privacypolicy',
      'Google Analytics (if enabled): subject to Google\'s privacy policy. You can opt out via browser extensions.',
      'Amazon/Newegg/B&H (affiliate): clicking affiliate links is subject to those retailers\' privacy policies.',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'You can use this site without providing any personal data.',
      'If you joined our email list, you can unsubscribe at any time via the link in any email.',
      'GDPR (EU users): you have the right to access, correct, or delete your data. Email us to exercise these rights.',
      'CCPA (California users): we do not sell personal information.',
    ],
  },
  {
    title: 'Contact',
    content: [
      'For privacy questions, email: privacy@YOUR-DOMAIN.com',
      `Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-[--clr-text-secondary] mb-10">
          {SITE_NAME} is committed to protecting your privacy. This policy explains what data
          we collect, why, and how we handle it. Short version: we collect almost nothing.
        </p>

        <div className="space-y-8">
          {sections.map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-lg font-semibold mb-3 text-[--clr-accent]">{title}</h2>
              <ul className="space-y-2">
                {content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[--clr-text-secondary]">
                    <span className="text-[--clr-accent] mt-0.5 flex-shrink-0">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
