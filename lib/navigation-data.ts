// lib/navigation-data.ts
import { CPUs, GPUs } from './hardware-data'

// Fetch top 2 trending GPUs and CPUs based on performance rank scores safely
const topGpus = [...GPUs].sort((a, b) => b.benchmarkScore - a.benchmarkScore).slice(0, 2)
const topCpus = [...CPUs].sort((a, b) => b.benchmarkScore - a.benchmarkScore).slice(0, 2)

export const mainNavLinks = [
  { href: '/', label: 'Calculator', desc: 'Check your custom system build' },
  { href: '/gpu', label: 'GPUs', desc: 'All graphics cards indexed' },
  { href: '/cpu', label: 'CPUs', desc: 'All processors indexed' },
  { href: '/games', label: 'Games', desc: 'Per-game FPS benchmarks' },
  { href: '/faq', label: 'FAQ', desc: 'Common community questions' },
]

export const footerLinks = {
  Tools: [
    { label: 'Bottleneck Calculator', href: '/' },
    { label: 'GPU Index', href: '/gpu' },
    { label: 'CPU Index', href: '/cpu' },
    { label: 'RAM Rankings', href: '/ram' },
    { label: 'SSD Rankings', href: '/storage' },
  ],
  Learn: [
    { label: 'Game FPS Database', href: '/games' },
    { label: 'FAQ', href: '/faq' },
    { label: 'About Us', href: '/about' },
  ],
  Popular: [
    ...topGpus.map(gpu => ({
      label: `${gpu.name.replace(/nvidia\s|amd\s|intel\s/i, '')} Analysis`,
      href: `/gpu/${gpu.id}`,
    })),
    ...topCpus.map(cpu => ({
      label: `${cpu.name.replace(/intel\s|amd\s/i, '')} Guide`,
      href: `/cpu/${cpu.id}`,
    })),
  ],
}
