import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Privacy Policy | PC Bottleneck Calculator',
  description: 'Privacy policy detailing how we handle user data and privacy.',
}

export default function PolicyPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-[--clr-text-secondary] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">1. Information We Collect</h2>
            <p>
              We collect information that your browser sends whenever you visit our website. This data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, and the time spent on those pages.
              Our calculator tool operates primarily on the client-side, and we do not store the hardware combinations you test unless you explicitly choose to save a build or share it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">2. Cookies and Local Storage</h2>
            <p>
              We use standard browser features like Local Storage to save your "Saved Builds" locally on your device. This ensures you can return to your calculations later without needing an account. We do not use third-party tracking cookies to monitor your behavior across the web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">3. Use of Information</h2>
            <p>
              Any of the information we collect from you may be used to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Improve our website performance and user experience</li>
              <li>Analyze aggregate trends in hardware combinations</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">4. Information Protection</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. Since our core service does not require an account, we minimize the amount of personally identifiable information we collect and store.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">5. Third-Party Links</h2>
            <p>
              Occasionally, at our discretion, we may include or offer third-party products or links to external benchmarking sites. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
