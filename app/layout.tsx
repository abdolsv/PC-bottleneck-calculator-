// app/layout.tsx
import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ToastProvider } from '@/components/ui/Toast'
import Script from 'next/script'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Programmatic year calculation to keep SEO dynamic and evergreen
const currentYear = new Date().getFullYear()

export const metadata: Metadata = {
  metadataBase: new URL('https://pcbottleneck.vercel.app/'),
  title: {
    default: `PC Bottleneck Calculator — Free CPU & GPU Compatibility Tool (${currentYear})`,
    template: `%s | PC Bottleneck Calculator`,
  },
  description:
    `Find out if your CPU is bottlenecking your GPU in seconds. Free PC bottleneck calculator for gaming, streaming, and content creation in ${currentYear}. Instant results, no signup.`,
  keywords: [
    'pc bottleneck calculator',
    'bottleneck pc calculator',
    'cpu gpu bottleneck',
    'pc build bottleneck',
    'is my pc bottlenecked',
    'bottleneck calculator pc',
    `best pc build config ${currentYear}`,
    'hardware balancing utility'
  ],
  authors: [{ name: 'PC Bottleneck Calculator' }],
  creator: 'PC Bottleneck Calculator',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pcbottleneck.vercel.app/',
    siteName: 'PC Bottleneck Calculator',
    title: `PC Bottleneck Calculator — Free CPU & GPU Compatibility Tool (${currentYear})`,
    description:
      `Find out if your CPU is bottlenecking your GPU instantly. Free, accurate, completely updated for ${currentYear} hardware setups. No signup required.`,
    images: [{ url: '/og', width: 1200, height: 630, alt: 'PC Bottleneck Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `PC Bottleneck Calculator (${currentYear})`,
    description: 'Free CPU & GPU bottleneck analysis tool',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '1NWH8PUXZMUGf_QdZ72WhlBOM2Ly2AF61cJ9VQcvSfg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'PC Bottleneck Calculator',
    'alternateName': ['PC Bottleneck', 'Bottleneck Calculator'],
    'url': 'https://pcbottleneck.vercel.app/',
  }

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Google AdSense optimized asynchronous wrapper script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9684068750213566"
          crossOrigin="anonymous" 
          strategy="afterInteractive"
        />
      </head>
      <body className="font-[var(--font-display)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-EMCMP725FK" />
      </body>
    </html>
  )
}
