// app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'PC Hardware Blog — Bottleneck Guides & Build Tips',
  description: 'In-depth guides on CPU/GPU bottlenecking, best hardware pairings, and PC build optimization.',
}

// In production, load these from a CMS (Contentful, Sanity, or MDX files)
export const BLOG_POSTS = [
  {
    slug: 'best-cpu-for-rtx-4090',
    title: 'Best CPU for RTX 4090 — No Bottleneck Builds',
    excerpt: 'The RTX 4090 is the most powerful consumer GPU ever made. Here\'s every CPU that can keep up with it at 1080p, 1440p, and 4K.',
    date: '2025-04-10',
    readTime: '8 min',
    category: 'GPU Guides',
    keywords: ['rtx 4090 best cpu', 'rtx 4090 bottleneck cpu'],
  },
  {
    slug: 'is-8gb-ram-enough-gaming-2025',
    title: 'Is 8GB RAM Enough for Gaming in 2025?',
    excerpt: 'With modern games regularly exceeding 8GB VRAM, what does running only 8GB system RAM actually do to your frame rates?',
    date: '2025-04-22',
    readTime: '6 min',
    category: 'RAM Guides',
    keywords: ['is 8gb ram enough', '8gb ram gaming 2025'],
  },
  {
    slug: 'rtx-4070-super-bottleneck-guide',
    title: 'RTX 4070 Super — Complete Bottleneck Guide',
    excerpt: 'The RTX 4070 Super is the sweet spot GPU of 2024. We test it with every major CPU to find perfect pairings.',
    date: '2025-05-01',
    readTime: '10 min',
    category: 'GPU Guides',
    keywords: ['rtx 4070 super bottleneck', 'best cpu rtx 4070 super'],
  },
  {
    slug: 'ryzen-5-7600x-vs-i5-13600k',
    title: 'Ryzen 5 7600X vs i5-13600K — Which Bottlenecks Less?',
    excerpt: 'Two of the most popular mid-range CPUs head-to-head. Which one pairs better with modern GPUs for 1440p gaming?',
    date: '2025-05-08',
    readTime: '7 min',
    category: 'CPU Comparisons',
    keywords: ['ryzen 5 7600x vs i5 13600k', 'best mid range cpu gaming'],
  },
]

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Hardware Blog</h1>
        <p className="text-[--clr-text-secondary] mb-10">
          In-depth guides on bottlenecking, CPU/GPU pairings, and getting the most from your build.
        </p>

        <div className="grid gap-4">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card p-6 hover:border-[--clr-border-glow] transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[--clr-accent-dim] text-[--clr-accent] font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-[--clr-text-muted]">{post.readTime} read</span>
                  </div>
                  <h2 className="font-semibold group-hover:text-[--clr-accent] transition-colors mb-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[--clr-text-secondary] line-clamp-2">{post.excerpt}</p>
                </div>
                <span className="text-xs text-[--clr-text-muted] flex-shrink-0">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
