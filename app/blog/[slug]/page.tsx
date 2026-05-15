// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { BLOG_POSTS } from '../page'
import { SITE_URL } from '@/lib/constants'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  }
}

// In production, load content from MDX or a CMS.
// This is a placeholder that shows the structure.
const PLACEHOLDER_CONTENT = `
  This is where the full blog post content goes. In production, load this from:
  - MDX files in /content/blog/[slug].mdx
  - Contentful CMS
  - Sanity.io
  - Notion API
  
  Each post should be 1,500–3,000 words to rank well for its target keywords.
`

export default function BlogPostPage({ params }: Props) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'PC Bottleneck Calculator' },
    publisher: { '@type': 'Organization', name: 'PC Bottleneck Calculator', url: SITE_URL },
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-[--clr-text-muted] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[--clr-accent]">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-[--clr-accent]">Blog</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary]">{post.title}</span>
        </nav>

        <span className="text-xs px-2 py-0.5 rounded-full bg-[--clr-accent-dim] text-[--clr-accent] font-medium">
          {post.category}
        </span>
        <h1 className="text-3xl font-bold mt-3 mb-2">{post.title}</h1>
        <p className="text-[--clr-text-secondary] mb-1">{post.excerpt}</p>
        <p className="text-xs text-[--clr-text-muted] mb-10">{post.date} · {post.readTime} read</p>

        {/* CTA before content */}
        <div className="card p-4 mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-[--clr-text-secondary]">Check your own build while you read:</p>
          <Link href="/" className="px-4 py-2 rounded-[--radius-sm] bg-[--clr-accent] text-[--clr-bg] text-sm font-semibold whitespace-nowrap">
            Open Calculator →
          </Link>
        </div>

        {/* Article body — replace with MDX or CMS content */}
        <div className="prose prose-invert max-w-none text-[--clr-text-secondary] leading-relaxed">
          <p>{PLACEHOLDER_CONTENT}</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
