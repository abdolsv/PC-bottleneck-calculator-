import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Privacy Policy | PC Bottleneck Calculator',
  description: 'Privacy policy for PC Bottleneck Calculator. We collect minimal data. Your builds stay in your browser. No account required.',
}

const lastUpdated = 'May 16, 2026'

export default function PolicyPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-[--clr-text-secondary]">Last updated: <span className="font-mono text-xs">{lastUpdated}</span></p>
          <div className="mt-4 p-4 rounded-[--radius-sm] bg-[--clr-bg-card] border border-[--clr-border] text-sm text-[--clr-text-secondary] leading-relaxed">
            <strong className="text-[--clr-text-primary]">TL;DR:</strong> We collect minimal data. We don't sell it. Your saved builds stay in your browser. The calculator works with no account and leaves no server-side trace of what you tested.
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { emoji: '🔒', title: 'No Account Needed', desc: 'The calculator works fully without any login or registration.' },
            { emoji: '💾', title: 'Local Storage Only', desc: 'Saved builds are stored in your browser, not our servers.' },
            { emoji: '🚫', title: 'No Data Selling', desc: 'We never sell, rent, or share your personal data with third parties.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="card p-5 text-center">
              <div className="text-2xl mb-2">{emoji}</div>
              <p className="font-semibold text-sm mb-1">{title}</p>
              <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8 text-[--clr-text-secondary] leading-relaxed">

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">1. Who We Are</h2>
            <p className="mb-3">
              PC Bottleneck Calculator is an independent website providing free hardware bottleneck analysis tools. We are not affiliated with any hardware manufacturer, retailer, or benchmark organization.
            </p>
            <p className="text-sm">
              This Privacy Policy explains how we collect, use, and protect information when you use our website and tools.
            </p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">2. Information We Collect</h2>

            <h3 className="font-semibold text-[--clr-text-primary] mb-2 mt-4">2a. Information Collected Automatically</h3>
            <p className="text-sm mb-3">
              When you visit our website, our hosting provider and analytics tools may collect standard web server logs, including:
            </p>
            <ul className="space-y-1.5 text-sm mb-4">
              {[
                'Your IP address (anonymized after 24 hours)',
                'Browser type and version',
                'Operating system',
                'Referring URL (what site you came from)',
                'Pages visited and time spent',
                'General geographic region (country/city, not precise location)',
              ].map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="w-1 h-1 rounded-full bg-[--clr-accent] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-[--clr-text-primary] mb-2">2b. Information You Provide</h3>
            <p className="text-sm mb-3">
              If you subscribe to our newsletter, we collect your email address. This is entirely optional. We use this solely to send hardware tips and site updates — never for advertising third-party products.
            </p>

            <h3 className="font-semibold text-[--clr-text-primary] mb-2">2c. Calculator Usage Data</h3>
            <p className="text-sm">
              The CPU, GPU, and settings you choose in our calculator are processed <strong className="text-[--clr-text-primary]">entirely in your browser</strong>. These selections are not sent to our servers and are not stored beyond your current session unless you explicitly use the "Save Build" feature (which uses browser Local Storage — see Section 4).
            </p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">3. Cookies & Tracking</h2>
            <p className="mb-4">We use a minimal set of cookies and do not use cross-site tracking cookies.</p>

            <div className="space-y-3">
              {[
                {
                  type: 'Essential Cookies',
                  color: '--clr-low',
                  desc: 'Used only for core site functionality. These cannot be disabled without breaking the site.',
                  examples: ['Session continuity', 'CSRF protection (if forms are used)'],
                },
                {
                  type: 'Analytics Cookies',
                  color: '--clr-medium',
                  desc: 'We use privacy-respecting analytics (Vercel Analytics or equivalent) to understand aggregate page traffic. No personal identifiers are stored.',
                  examples: ['Page view counts', 'Popular hardware searches (aggregated)', 'Error rate monitoring'],
                },
                {
                  type: 'Affiliate Cookies',
                  color: '--clr-accent',
                  desc: 'When you click an Amazon affiliate link, Amazon may set cookies to track the purchase for commission attribution. This is governed by Amazon\'s Privacy Policy, not ours.',
                  examples: ['Amazon Associates tracking (only when you click a Buy link)'],
                },
              ].map(({ type, color, desc, examples }) => (
                <div key={type} className="p-4 rounded-[--radius-sm] bg-[--clr-bg-elevated] border-l-2" style={{ borderLeftColor: `var(${color})` }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: `var(${color})` }}>{type}</p>
                  <p className="text-xs text-[--clr-text-secondary] mb-2">{desc}</p>
                  <ul className="space-y-0.5">
                    {examples.map((ex, i) => (
                      <li key={i} className="text-xs text-[--clr-text-muted]">→ {ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">4. Browser Local Storage</h2>
            <p className="mb-3">
              When you save a build using the "Save Build" feature, that data is written to your browser's <code className="font-mono text-xs bg-[--clr-bg-elevated] px-1 py-0.5 rounded">localStorage</code>. This means:
            </p>
            <ul className="space-y-2 text-sm mb-4">
              {[
                'The data stays on your device — we never receive it',
                'It persists across browser sessions until you clear your browser data',
                'It is not shared between devices or browsers',
                'You can delete it at any time by clearing your browser\'s site data for our domain',
              ].map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[--clr-ok] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm p-3 rounded bg-[--clr-bg-elevated] border border-[--clr-border]">
              To clear your saved builds: Open browser DevTools → Application → Local Storage → delete entries prefixed with <code className="font-mono text-xs">pcb-</code>.
            </p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">5. Amazon Associates Disclosure</h2>
            <p className="mb-3">
              PC Bottleneck Calculator is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
            </p>
            <p className="mb-3 text-sm">
              When you click a "Check Price on Amazon" link and make a purchase, we may receive a commission. This comes at <strong className="text-[--clr-text-primary]">no extra cost to you</strong> and helps fund the development and hosting of this free tool.
            </p>
            <p className="text-sm text-[--clr-text-muted]">
              Our affiliate relationships do not influence our hardware rankings, bottleneck calculations, or editorial recommendations. We never prioritize products based on commission rates.
            </p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">6. How We Use Your Data</h2>
            <p className="mb-3">The minimal data we do collect is used only to:</p>
            <ul className="space-y-2 text-sm">
              {[
                'Understand aggregate traffic patterns to improve site performance',
                'Monitor error rates and fix bugs quickly',
                'Send newsletter updates to subscribers who explicitly opted in',
                'Identify and prevent malicious API abuse',
              ].map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[--clr-accent] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">7. Data Sharing & Third Parties</h2>
            <p className="mb-3">
              We do not sell, rent, or trade your personal information to third parties. We may share anonymized, aggregate data (e.g., "RTX 4070 was searched 12,000 times this month") for public reporting.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-[--clr-text-primary]">Third-party services we use:</p>
              {[
                { name: 'Vercel', purpose: 'Hosting and edge delivery. Subject to Vercel\'s Privacy Policy.' },
                { name: 'Amazon Associates', purpose: 'Affiliate link tracking when you click Buy links. Subject to Amazon\'s Privacy Policy.' },
                { name: 'Mailchimp (optional)', purpose: 'Newsletter delivery if you subscribe. You can unsubscribe at any time.' },
              ].map(({ name, purpose }) => (
                <div key={name} className="p-3 rounded bg-[--clr-bg-elevated] flex gap-3">
                  <span className="font-mono text-xs font-bold text-[--clr-accent] flex-shrink-0 w-28">{name}</span>
                  <span className="text-xs text-[--clr-text-secondary]">{purpose}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">8. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 text-sm mb-3">
              {[
                'Access the personal data we hold about you (which is minimal)',
                'Request deletion of your data (newsletter unsubscribe, browser data clear)',
                'Opt out of analytics collection (use a browser extension like uBlock Origin)',
                'Request a copy of your data in a portable format',
              ].map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[--clr-accent] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[--clr-text-muted]">
              To exercise any of these rights, contact us via the link in our footer.
            </p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">9. Children's Privacy</h2>
            <p>
              Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it.
            </p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--clr-text-primary] mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will update the "Last updated" date at the top of this page when we do. Continued use of the Service after changes constitutes acceptance of the new policy.
            </p>
          </section>

          <section className="card p-5 text-center bg-[--clr-bg-elevated]">
            <p className="text-sm text-[--clr-text-secondary] mb-1">Questions about this policy?</p>
            <p className="text-xs text-[--clr-text-muted]">Contact us via the link in our footer. We aim to respond within 48 business hours.</p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
