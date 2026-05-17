// lib/navigation-data.ts
import { CPUs, GPUs } from './hardware-data'

// Fetch top 2 trending GPUs and CPUs based on performance rank scores safely
const topGpus = [...GPUs].sort((a, b) => b.benchmarkScore - a.benchmarkScore).slice(0, 2)
const topCpus = [...CPUs].sort((a, b) => b.benchmarkScore - a.benchmarkScore).slice(0, 2)

export const mainNavLinks = [
  { href: '/', label: 'Calculator', desc: 'Check your custom system build build' },
  { href: '/gpu', label: 'GPUs', desc: 'All dynamic graphics cards inventory' },
  { href: '/cpu', label: 'CPUs', desc: 'All processing units taxonomy' },
  { href: '/games', label: 'Games', desc: 'Bottleneck metrics gaming logs' },
  { href: '/faq', label: 'FAQ', desc: 'Common community questions' },
]

export const footerLinks = {
  Tools: [
    { label: 'Bottleneck Calculator', href: '/' },
    { label: 'GPU Comparison', href: '/gpu' },
    { label: 'CPU Comparison', href: '/cpu' },
  ],
  Learn: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Games', href: '/games' },
    { label: 'About', href: '/about' },
  ],
  Popular: [
    ...topGpus.map(gpu => ({
      label: `${gpu.name.replace(/nvidia\s|amd\s|intel\s/i, '')} Analysis`,
      href: `/gpu/${gpu.id}`
    })),
    ...topCpus.map(cpu => ({
      label: `${cpu.name.replace(/intel\s|amd\s/i, '')} Guide`,
      href: `/cpu/${cpu.id}`
    }))
  ]
}
