<div align="center">

<!-- Logo / Icon -->
<img src="public/file.svg" alt="PC Bottleneck Calculator Logo" width="80" height="80" />

# PC Bottleneck Calculator

**The most accurate, data-driven CPU & GPU bottleneck calculator on the internet — completely free, no account required.**

[![Live Site](https://img.shields.io/badge/Live%20Site-pcbottleneckcal.netlify.app-00d4ff?style=flat-square&logo=netlify&logoColor=white)](https://pcbottleneckcal.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22d3a0?style=flat-square)](LICENSE)

[**Live Demo**](https://pcbottleneckcal.netlify.app) · [**API Docs**](#api-reference) · [**Report a Bug**](https://pcbottleneckcal.netlify.app/faq) · [**Request a Feature**](mailto:staysafewithusonline@gmail.com)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshot](#screenshot)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Bottleneck Engine](#bottleneck-engine)
- [Hardware Database](#hardware-database)
- [API Reference](#api-reference)
- [Programmatic SEO](#programmatic-seo)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PC Bottleneck Calculator answers the question every builder asks: *"Will my CPU limit my GPU?"* — with real benchmark data, not vague tier lists.

Most bottleneck calculators compare raw specs and output a single generic number. This tool accounts for **resolution**, **use case**, **IPC generation**, **VRAM adequacy**, **RAM speed**, **thermal throttling**, and **overclocking** — producing a meaningful, resolution-aware bottleneck percentage for any CPU × GPU pairing from the last 15 years.

The engine is built on **2.8 million normalized UserBenchmark reports**, cross-referenced against independent benchmarks from Digital Foundry, GamersNexus, and TechPowerUp.

---

## Key Features

| Feature | Description |
|---|---|
| **Instant Calculation** | Client-side engine — results in milliseconds, no server round-trip |
| **Resolution Weighting** | 4K shifts ~80% of workload to the GPU; 1080p raises CPU dependency to ~45% |
| **Use-Case Profiles** | Gaming 1080p / 1440p / 4K, Game Streaming, Video Editing, General Use |
| **RAM Impact** | Speed (DDR4-3200 → DDR5-6000) and size (8 GB stutter penalty) modeled separately |
| **Advanced Options** | CPU/GPU overclock offsets (+0–30% / +0–20%) and thermal throttling simulation |
| **500+ CPUs & 300+ GPUs** | Intel, AMD, NVIDIA, and Intel Arc — from legacy to flagship |
| **40+ Game Profiles** | Per-game FPS estimates and CPU/GPU workload split ratios |
| **170,000+ Build Pages** | Every CPU × GPU pairing has a statically-generated SEO page |
| **Public REST API** | Query any pairing programmatically — 30 req/min, no key required |
| **Save & Share Builds** | Builds stored in browser localStorage; shareable via URL params |
| **Privacy First** | Zero server-side tracking of your selections |

---

## Screenshot

```
┌─────────────────────────────────────────────────────┐
│  PCBottleneck  Calculator  GPUs  CPUs  Games  FAQ    │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Is Your CPU Bottlenecking Your GPU?               │
│                                                     │
│   ┌──────────────────┐  ┌──────────────────┐       │
│   │ CPU: i5-13600K   │  │ GPU: RTX 4070    │       │
│   └──────────────────┘  └──────────────────┘       │
│                                                     │
│   Use Case: [ 1080p ] [ 1440p ✓] [ 4K ] ...        │
│   RAM:      [ 8GB ]  [ 16GB ✓]  [ 32GB ] [ 64GB ]  │
│                                                     │
│   ┌─── RESULT ────────────────────────────────┐     │
│   │  Minor Bottleneck          CPU     8%     │     │
│   │  ████████░░░░░░░░░░░░░░░░░░░░░░░          │     │
│   │  CPU Util: 89%   GPU Util: 85%            │     │
│   │  Efficiency Score: 92 / 100               │     │
│   └───────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) — App Router, ISR, Edge Runtime |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) — fully typed data pipeline |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) with CSS custom properties |
| **Search** | [Fuse.js 7](https://fusejs.io) — client-side fuzzy search, typo-tolerant |
| **Charts** | [Recharts 3](https://recharts.org) — interactive performance visualizations |
| **Fonts** | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via `next/font` |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) + [Google Analytics 4](https://analytics.google.com) |
| **Hosting** | [Vercel](https://vercel.com) / [Netlify](https://netlify.com) — edge deployment |
| **Monetisation** | Amazon Associates affiliate links |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/PC-bottleneck-calculator-.git
cd PC-bottleneck-calculator-

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Required for canonical URLs and sitemap
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional: Amazon Associates affiliate tag
NEXT_PUBLIC_AMAZON_TAG=your-tag-20

# Optional: Mailchimp newsletter integration
MAILCHIMP_API_KEY=your-api-key
MAILCHIMP_SERVER=us1
MAILCHIMP_LIST_ID=your-list-id
```

### Running Locally

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Importing Hardware Data

The hardware database is driven by CSV files exported from UserBenchmark. To regenerate the JSON data files:

```bash
# Place CSV files in the project root:
#   CPU_UserBenchmarks.csv
#   GPU_UserBenchmarks.csv
#   RAM_UserBenchmarks.csv
#   SSD_UserBenchmarks.csv

node scripts/convert.js
```

This outputs normalized JSON files to `data/` which are imported directly by the Next.js application at build time — no database or runtime server required.

---

## Project Structure

```
pc-bottleneck-calculator/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (calculator + hero)
│   ├── layout.tsx                # Root layout, fonts, metadata
│   ├── globals.css               # Design tokens, Tailwind base
│   ├── about/page.tsx            # About page
│   ├── faq/page.tsx              # FAQ with JSON-LD schema
│   ├── cpu/
│   │   ├── page.tsx              # CPU index
│   │   └── [slug]/page.tsx       # CPU detail + full GPU matrix
│   ├── gpu/
│   │   ├── page.tsx              # GPU index
│   │   └── [slug]/page.tsx       # GPU detail + full CPU matrix
│   ├── build/
│   │   └── [cpuId]/[gpuId]/      # CPU × GPU pairing pages (ISR)
│   ├── games/
│   │   ├── page.tsx              # Games index
│   │   └── [slug]/page.tsx       # Per-game FPS + requirements
│   ├── ram/
│   │   ├── page.tsx              # RAM rankings
│   │   └── [slug]/page.tsx       # RAM kit detail
│   ├── storage/
│   │   ├── page.tsx              # SSD rankings
│   │   └── [slug]/page.tsx       # SSD detail
│   ├── api/
│   │   ├── bottleneck/route.ts   # Public REST API
│   │   └── subscribe/route.ts    # Newsletter endpoint
│   ├── og/route.tsx              # Dynamic OG image generation
│   ├── sitemap.xml/route.ts      # Sitemap index
│   └── sitemap/[[...id]]/        # Chunked sitemaps (5,000 URLs each)
│
├── components/
│   ├── calculator/
│   │   ├── BottleneckCalculator.tsx   # Main interactive calculator
│   │   ├── ComponentSelector.tsx      # Fuzzy-search dropdown
│   │   ├── UseCaseSelector.tsx        # Resolution/use-case picker
│   │   ├── ResultDisplay.tsx          # Result card + upgrade CTA
│   │   └── CustomComponentModal.tsx   # Add unlisted hardware
│   ├── layout/
│   │   ├── Header.tsx                 # Sticky nav, mobile menu
│   │   └── Footer.tsx                 # Links, newsletter, legal
│   ├── cpu/CpuSearchList.tsx          # Client-side CPU search
│   ├── gpu/GpuSearchList.tsx          # Client-side GPU search
│   ├── ram/RamSearchList.tsx          # Client-side RAM search
│   ├── storage/StorageSearchList.tsx  # Client-side SSD search with pagination
│   ├── tables/RankingTable.tsx        # Reusable ranking table
│   ├── seo/JsonLd.tsx                 # Schema.org structured data
│   └── ui/                            # Design system components
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── ProgressBar.tsx
│       ├── AmazonButton.tsx
│       ├── Toast.tsx
│       └── ThemeToggle.tsx
│
├── lib/
│   ├── bottleneck-engine.ts      # Core calculation logic
│   ├── hardware-data.ts          # Data loading + type definitions
│   ├── games-data.ts             # Game profiles + FPS baselines
│   ├── fps-engine.ts             # FPS estimation model
│   ├── build-storage.ts          # localStorage save/load
│   ├── custom-hardware.ts        # User-defined component storage
│   ├── navigation-data.ts        # Nav links + footer links
│   ├── pdf-generator.ts          # Client-side PDF report export
│   └── constants.ts              # Site URL, name, description
│
├── data/                         # Generated JSON (via scripts/convert.js)
│   ├── cpus.json
│   ├── gpus.json
│   ├── ram.json
│   └── storage.json
│
├── scripts/
│   └── convert.js                # CSV → JSON data pipeline
│
├── public/
│   ├── llms.txt                  # AI assistant platform description
│   ├── robots.txt
│   └── og/                       # OG image assets
│
└── package.json
```

---

## Bottleneck Engine

The core algorithm lives in [`lib/bottleneck-engine.ts`](lib/bottleneck-engine.ts). It runs entirely in the browser — no server, no latency.

### Calculation Pipeline

```
CPU benchmark score (0–100)
GPU benchmark score (0–100)
         │
         ▼
1. Apply RAM speed boost to CPU score
   DDR4-3200 = baseline (+0%)
   DDR4-3600 = +1.8% (use-case weighted)
   DDR5-5600 = +3.5%
   DDR5-6000 = +5.0%
         │
         ▼
2. Apply VRAM adequacy factor to GPU score
   4GB GPU at 4K → ×0.78 penalty
   6GB GPU at 1440p → ×0.96 penalty
         │
         ▼
3. Calculate raw mismatch ratios
   cpuBottleneckRaw = (gpuScore - cpuScore) / gpuScore
   gpuBottleneckRaw = (cpuScore - gpuScore) / cpuScore
         │
         ▼
4. Apply use-case weights × resolution dampening
   gaming-1080p:  cpuWeight=0.45, gpuWeight=0.55
   gaming-1440p:  cpuWeight=0.35, gpuWeight=0.65
   gaming-4k:     cpuWeight=0.20, gpuWeight=0.80
   streaming:     cpuWeight=0.60, gpuWeight=0.40
   video-editing: cpuWeight=0.65, gpuWeight=0.35

   CPU bottleneck is additionally dampened at 4K (×0.38)
   and 1440p (×0.72) to match empirical cpu-swap data.
         │
         ▼
5. Add RAM size penalty (independent of score mismatch)
   < 16 GB + gaming → +8%
   < 16 GB + streaming → +8%
   < 16 GB + video-editing → +15%
         │
         ▼
6. Clamp to 0–100%
         │
         ▼
7. Derive CPU/GPU utilization estimates
   Bottlenecking component → near 100%
   Other component → proportionally lower
         │
         ▼
8. Map to severity + label + colour
   0–5%   → No Bottleneck  (#00d4ff)
   6–20%  → Minor          (#22d3a0)
   21–40% → Moderate       (#f5a524)
   41–60% → Significant    (#ef4444)
   61%+   → Severe         (#ff2056)
```

### Advanced Modifiers

| Option | Effect |
|---|---|
| CPU Overclock (+5–30%) | Multiplies effective CPU benchmark score |
| GPU Overclock (+5–20%) | Multiplies effective GPU benchmark score |
| Thermal Throttling | Applies ×0.92 penalty to CPU score |

---

## Hardware Database

Data is loaded from `data/cpus.json` and `data/gpus.json` at build time, deduplicated by ID, and exported as typed arrays.

### CPU Schema

```typescript
interface CPU {
  id: string            // e.g. "intel-core-i5-13600k"
  name: string          // e.g. "Intel Core i5-13600K"
  brand: 'Intel' | 'AMD'
  generation: string    // e.g. "Core i5 Series"
  cores: number
  threads: number
  baseClock: number     // GHz
  boostClock: number    // GHz
  tdp: number           // Watts
  tier: 1 | 2 | 3 | 4 | 5
  benchmarkScore: number  // 0–100
  releaseYear: number
  socket: string        // e.g. "LGA1700", "AM5"
}
```

### GPU Schema

```typescript
interface GPU {
  id: string            // e.g. "nvidia-rtx-4070"
  name: string          // e.g. "NVIDIA GeForce RTX 4070"
  brand: 'NVIDIA' | 'AMD' | 'Intel'
  vram: number          // GB
  tier: 1 | 2 | 3 | 4 | 5
  benchmarkScore: number  // 0–100
  tdp: number           // Watts
  releaseYear: number
  targetResolution: '1080p' | '1440p' | '4K' | 'all'
}
```

### Adding New Hardware

1. Add a row to `data/cpus.json` or `data/gpus.json` following the schema above.
2. Assign a benchmark score relative to the existing scale (RTX 4090 = 100, RTX 4060 = ~50).
3. Run `npm run build` — the new entry appears immediately across all pages.

---

## API Reference

A public REST API is available for third-party integrations. No API key required.

### `GET /api/bottleneck`

Returns a bottleneck analysis for any CPU × GPU pairing.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `cpu` | string | ✅ | — | CPU ID slug (e.g. `intel-core-i5-13600k`) |
| `gpu` | string | ✅ | — | GPU ID slug (e.g. `nvidia-rtx-4070`) |
| `use` | string | ❌ | `gaming-1440p` | Use case: `gaming-1080p`, `gaming-1440p`, `gaming-4k`, `streaming`, `video-editing`, `general` |
| `ram` | number | ❌ | `16` | System RAM in GB |

**Example Request**

```bash
curl "https://pcbottleneckcal.netlify.app/api/bottleneck\
?cpu=intel-core-i5-13600k\
&gpu=nvidia-rtx-4070\
&use=gaming-1440p\
&ram=16"
```

**Example Response**

```json
{
  "cpu": "Intel Core i5-13600K",
  "gpu": "NVIDIA RTX 4070",
  "useCase": "gaming-1440p",
  "ram": 16,
  "result": {
    "percentage": 8,
    "bottlenecker": "CPU",
    "severity": "low",
    "label": "Minor Bottleneck",
    "color": "--clr-low",
    "recommendation": "Minor mismatch — under 8% real-world performance loss. Acceptable for most builds; no urgent action needed.",
    "upgradeTarget": "CPU",
    "efficiencyScore": 92,
    "cpuUtilization": 89,
    "gpuUtilization": 85,
    "details": [
      "CPU benchmark score: 77/100",
      "GPU benchmark score: 72/100",
      "Estimated CPU utilization: ~89%",
      "Estimated GPU utilization: ~85%",
      "Use case weighting: CPU 35% / GPU 65%",
      "DDR4-3200: baseline — no additional CPU boost",
      "16GB RAM — sufficient for this use case"
    ]
  }
}
```

**Rate Limiting**

30 requests per minute per IP. Returns `HTTP 429` on excess.

> **Note**: In-memory rate limiting clears on cold starts. For distributed deployments requiring hard limits, migrate `requestCounts` to an Upstash Redis adapter.

### `POST /api/bottleneck`

Returns API documentation including all available CPU IDs, GPU IDs, and use case options.

```bash
curl -X POST "https://pcbottleneckcal.netlify.app/api/bottleneck"
```

### Response CDN Caching

API responses include `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` — identical queries are served from the CDN edge for up to 1 hour.

---

## Programmatic SEO

The site generates **170,000+** statically-rendered pages targeting specific hardware search queries.

| Route Pattern | Count | Target Query Example |
|---|---|---|
| `/cpu/[id]` | 500+ | `"i5-13600K bottleneck"` |
| `/gpu/[id]` | 300+ | `"RTX 4070 best CPU pairing"` |
| `/build/[cpuId]/[gpuId]` | 150×150 = 22,500 pre-built + ISR | `"i5-13600K RTX 4070 bottleneck"` |
| `/games/[slug]` | 40+ | `"Cyberpunk 2077 PC requirements"` |
| `/ram/[id]` | varies | `"Corsair Vengeance DDR5 benchmark"` |
| `/storage/[id]` | varies | `"Samsung 990 Pro review"` |

### ISR Strategy

- **Build pages** (`/build/[cpuId]/[gpuId]`): Top 400 combinations (20 CPUs × 20 GPUs) are pre-rendered at build time. All other combinations are generated on-demand and cached at the CDN for 24 hours (`revalidate = 86400`).
- **CPU/GPU pages**: Generated on demand, cached 24 hours.
- **Game pages**: All 40+ generated at build time via `generateStaticParams`.

### Sitemaps

Sitemaps are chunked at 5,000 URLs each and served via the `/sitemap.xml` index route. The sitemap index auto-generates chunk references — no manual updates required when adding hardware.

---

## Configuration

### Design Tokens

All colours, spacing, and radius values are CSS custom properties defined in [`app/globals.css`](app/globals.css):

```css
:root {
  --clr-bg:           #0a0b0f;   /* Base background */
  --clr-accent:       #00d4ff;   /* Electric cyan — low bottleneck = good */
  --clr-ok:           #00d4ff;   /* 0–5% bottleneck */
  --clr-low:          #22d3a0;   /* 6–20% */
  --clr-medium:       #f5a524;   /* 21–40% */
  --clr-high:         #ef4444;   /* 41–60% */
  --clr-critical:     #ff2056;   /* 61%+ */
}
```

### Navigation

Update nav links in [`lib/navigation-data.ts`](lib/navigation-data.ts). Both the header and footer are driven from this single source of truth.

### Constants

Site URL, name, and description are configured in [`lib/constants.ts`](lib/constants.ts):

```typescript
export const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pcbottleneckcal.netlify.app/'
export const SITE_NAME = 'PC Bottleneck Calculator'
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Netlify

The project is pre-configured for Netlify deployment. Push to your connected repository and Netlify will detect Next.js automatically.

### Docker / Self-Hosted

```bash
# Build production image
docker build -t pc-bottleneck .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  pc-bottleneck
```

---

## Contributing

Contributions are welcome. Please follow the process below.

### Adding a New CPU or GPU

1. Fork the repository and create a branch: `git checkout -b feat/add-rtx-5090`
2. Add the entry to `data/cpus.json` or `data/gpus.json`
3. Assign an accurate benchmark score (use UserBenchmark or GamersNexus as a reference)
4. Run `npm run build` and verify the detail page renders correctly
5. Open a pull request with a description of the hardware added

### Adding a New Game

1. Add a `Game` object to the `GAMES` array in [`lib/games-data.ts`](lib/games-data.ts)
2. Set accurate `baseFps` values (tested against a reference build: cpuScore=75, gpuScore=75)
3. Set `gpuBound` (0 = fully CPU-bound, 1 = fully GPU-bound)
4. Set three-tier `requirements` (minimum / recommended / ultra)
5. Open a pull request

### Code Style

- TypeScript strict mode — no `any` types in new code
- Component files: PascalCase (`ResultDisplay.tsx`)
- Utility files: camelCase (`bottleneck-engine.ts`)
- Run `npm run lint` before opening a PR

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built by PC builders, for PC builders.**

[pcbottleneckcal.netlify.app](https://pcbottleneckcal.netlify.app) · [abdulwasiuabdulmajeed89@gmail.com](mailto:abdulwasiuabdulmajeed89@gmail.com)

</div>
