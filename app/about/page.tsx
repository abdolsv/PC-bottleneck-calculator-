import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'About Us | PC Bottleneck Calculator',
  description: 'Learn more about the team and technology behind our PC Bottleneck Calculator.',
}

function CodeCpuIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto mb-10 mt-8 group perspective-1000">
      {/* Outer socket glow */}
      <div className="absolute inset-0 bg-[--clr-accent] opacity-20 blur-2xl rounded-2xl group-hover:opacity-40 transition-opacity duration-700"></div>
      
      {/* CPU Substrate (Green PCB) */}
      <div className="absolute inset-2 bg-[#0d2a1c] border-2 border-[#164a33] rounded-lg shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:rotate-x-12 group-hover:rotate-y-12">
        {/* PCB Traces (using CSS background pattern) */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #1b6343 0px, #1b6343 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, #1b6343 0px, #1b6343 1px, transparent 1px, transparent 10px)`
          }}
        ></div>

        {/* Heat Spreader (Silver top) */}
        <div className="relative w-44 h-44 bg-gradient-to-br from-[#e0e4e8] via-[#a8b0ba] to-[#7f8893] rounded-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-4">
          {/* Logo / Branding on CPU */}
          <div className="text-[#3a4149] font-black text-2xl tracking-tighter opacity-80 mb-1">
            BOTTLENECK
          </div>
          <div className="text-[#3a4149] font-mono text-xs opacity-70 mb-4 font-bold border-b border-[#3a4149] pb-1">
            X9-9950X3D
          </div>
          
          <div className="flex gap-4 opacity-50">
            {/* Fake QR code / Data matrix */}
            <div className="w-6 h-6 grid grid-cols-4 grid-rows-4 gap-px bg-[#3a4149] p-px">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={Math.random() > 0.4 ? 'bg-[#a8b0ba]' : 'bg-[#3a4149]'}></div>
              ))}
            </div>
            <div className="text-[8px] text-[#3a4149] font-mono leading-tight text-right">
              MADE IN<br/>CYBERSPACE<br/>2026
            </div>
          </div>

          {/* Golden triangle pin indicator */}
          <div className="absolute bottom-2 left-2 w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-[#d4af37] border-r-[8px] border-r-transparent transform -rotate-45"></div>
        </div>

        {/* Golden Pins on the edges (visual effect) */}
        <div className="absolute top-1 left-2 right-2 h-1 flex justify-between px-2">
          {[...Array(15)].map((_, i) => <div key={`t${i}`} className="w-1 h-1 bg-[#d4af37] rounded-sm"></div>)}
        </div>
        <div className="absolute bottom-1 left-2 right-2 h-1 flex justify-between px-2">
          {[...Array(15)].map((_, i) => <div key={`b${i}`} className="w-1 h-1 bg-[#d4af37] rounded-sm"></div>)}
        </div>
        <div className="absolute left-1 top-2 bottom-2 w-1 flex flex-col justify-between py-2">
          {[...Array(15)].map((_, i) => <div key={`l${i}`} className="w-1 h-1 bg-[#d4af37] rounded-sm"></div>)}
        </div>
        <div className="absolute right-1 top-2 bottom-2 w-1 flex flex-col justify-between py-2">
          {[...Array(15)].map((_, i) => <div key={`r${i}`} className="w-1 h-1 bg-[#d4af37] rounded-sm"></div>)}
        </div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-[--clr-text-secondary] max-w-2xl mx-auto">
            We are building the definitive engine for understanding PC hardware compatibility, performance, and balance.
          </p>
        </div>

        <CodeCpuIllustration />

        <div className="space-y-8 text-[--clr-text-secondary] leading-relaxed max-w-3xl mx-auto">
          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[--clr-text-primary] mb-4">Our Mission</h2>
            <p className="mb-4">
              Building a PC or upgrading existing hardware can be a daunting task. The age-old question of "Will this CPU bottleneck my GPU?" has plagued PC builders for decades. Our mission is to demystify hardware performance and provide data-driven, accurate, and easy-to-understand insights for everyone from first-time builders to seasoned enthusiasts.
            </p>
            <p>
              We've analyzed millions of real-world benchmarks, cross-referenced game engine requirements, and built a dynamic calculator that adjusts based on your specific use cases—whether you're gaming at 1080p, 4K, or rendering high-resolution video.
            </p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[--clr-text-primary] mb-4">How We Calculate</h2>
            <p className="mb-4">
              Unlike simplistic calculators that just compare basic core counts or release dates, our engine relies on massive datasets of normalized performance metrics. We factor in:
            </p>
            <ul className="list-none space-y-2 mb-4">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[--clr-accent]"></span> <strong>Component Tiers & Generations:</strong> IPC improvements across generations.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[--clr-accent]"></span> <strong>Use Case Weighting:</strong> 4K gaming relies 80% on GPU, while 1080p gaming relies 45% on CPU.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[--clr-accent]"></span> <strong>RAM Latency & Capacity:</strong> Penalties for 8GB capacities in modern rendering pipelines.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[--clr-accent]"></span> <strong>Real-world modifiers:</strong> Adjustments for overclocking and thermal throttling.</li>
            </ul>
            <p>
              The result is a highly accurate estimate of how well your selected components will work together.
            </p>
          </section>
          
          <section className="card p-6 md:p-8 border-l-4 border-[--clr-accent]">
            <h2 className="text-2xl font-bold text-[--clr-text-primary] mb-4">The Data Engine</h2>
            <p>
              Our database is programmatically generated and updated using over 2.8 million UserBenchmark reports. By structuring this vast amount of data, we can instantly cross-reference any CPU against any GPU from the last 15 years, providing you with thousands of comparison combinations instantly.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
