import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

// Display/body font — sharp, technical, memorable
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

// Monospace for numbers/specs — feels authentic to hardware specs
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://YOUR-VERCEL-URL.vercel.app'), // ← update after first deploy
  title: {
    default: 'PC Bottleneck Calculator — Free CPU & GPU Compatibility Tool',
    template: '%s | PC Bottleneck Calculator',
  },
  description:
    'Find out if your CPU is bottlenecking your GPU in seconds. Free PC bottleneck calculator for gaming, streaming, and content creation. Instant results, no signup.',
  keywords: [
    'pc bottleneck calculator',
    'bottleneck pc calculator',
    'cpu gpu bottleneck',
    'pc build bottleneck',
    'is my pc bottlenecked',
    'bottleneck calculator pc',
  ],
  authors: [{ name: 'PC Bottleneck Calculator' }],
  creator: 'PC Bottleneck Calculator',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://YOUR-VERCEL-URL.vercel.app',
    siteName: 'PC Bottleneck Calculator',
    title: 'PC Bottleneck Calculator — Free CPU & GPU Compatibility Tool',
    description:
      'Find out if your CPU is bottlenecking your GPU instantly. Free, accurate, no signup required.',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'PC Bottleneck Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PC Bottleneck Calculator',
    description: 'Free CPU & GPU bottleneck analysis tool',
    images: ['/og/default.png'],
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-[var(--font-display)]">
        {children}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
