import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Terms of Service | PC Bottleneck Calculator',
  description: 'Terms of service and usage conditions for the PC Bottleneck Calculator.',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-[--clr-text-secondary] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the PC Bottleneck Calculator website, you accept and agree to be bound by the terms and provision of this agreement.
              In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">2. Description of Service</h2>
            <p>
              We provide users with an automated bottleneck calculation tool based on hardware benchmarks. 
              The service is provided "AS IS" and we assume no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">3. Accuracy of Information</h2>
            <p>
              While we strive for accuracy, the hardware benchmarks and bottleneck percentages provided by this site are estimates. 
              Real-world performance varies depending on numerous factors including thermal conditions, software optimization, background processes, and specific game engines.
              We are not responsible for hardware purchases made solely based on the calculations provided by this tool.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">4. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, icons, images, and software, is the property of PC Bottleneck Calculator or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[--clr-text-primary] mb-3">5. Disclaimer of Warranties</h2>
            <p>
              Your use of the service is at your sole risk. The service is provided on an "as is" and "as available" basis. 
              We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
