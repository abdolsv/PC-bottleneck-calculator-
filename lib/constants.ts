// lib/constants.ts
export const SITE_NAME = 'PC Bottleneck Calculator'
export const SITE_URL = 'https://YOUR-DOMAIN.vercel.app' // Update after deploy
export const SITE_DESCRIPTION = 'Free PC bottleneck calculator — find out if your CPU is limiting your GPU for gaming, streaming, and content creation.'
export const TWITTER_HANDLE = '@pcbottleneck' // update when you create the account
export const DEFAULT_OG_IMAGE = '/og/default.png'

// SEO: key pages (used in sitemap, nav, breadcrumbs)
export const PAGES = {
  home:   '/',
  faq:    '/faq',
  about:  '/about',
  blog:   '/blog',
} as const
