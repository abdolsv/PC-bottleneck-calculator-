<<<<<<< HEAD
n// lib/constants.ts
export const SITE_NAME        = 'PC Bottleneck Calculator'
export const SITE_URL         = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pcbottleneckcal.netlify.app/'
=======
export const SITE_NAME        = 'PC Bottleneck Calculator'
export const SITE_URL         = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pcbottleneckcal.netlify.app'
>>>>>>> 2f9d1dd (fixing generateStaticParams to pre-build the right pages, and making the sitemap reliably surface all 170k URLs to Google)
export const SITE_DESCRIPTION = 'Free PC bottleneck calculator — find out if your CPU is limiting your GPU for gaming, streaming, and content creation. Instant results, no signup required.'
export const TWITTER_HANDLE   = '@pcbottleneck'
export const DEFAULT_OG_IMAGE = '/og/default.png'

export const PAGES = {
  home:   '/',
  gpu:    '/gpu',
  cpu:    '/cpu',
  faq:    '/faq',
  about:  '/about',
  blog:   '/games',
} as const
