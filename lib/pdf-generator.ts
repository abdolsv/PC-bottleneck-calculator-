// lib/pdf-generator.ts
import type { CPU, GPU } from './hardware-data'
import type { BottleneckResult } from './bottleneck-engine'

export interface PDFData {
  cpu: CPU
  gpu: GPU
  result: BottleneckResult
  useCase: string
  ram: number
  timestamp?: Date
}

const severityColorMap: Record<string, string> = {
  none: '#00d4ff',
  low: '#22d3a0',
  medium: '#f5a524',
  high: '#ef4444',
  critical: '#ff2056',
}

const useCaseLabelMap: Record<string, string> = {
  'gaming-1080p':  'Gaming — 1080p',
  'gaming-1440p':  'Gaming — 1440p',
  'gaming-4k':     'Gaming — 4K',
  'streaming':     'Gaming + Streaming',
  'video-editing': 'Video Editing',
  'general':       'General Use',
}

export function generateBottleneckPDF(data: PDFData): void {
  const ts = data.timestamp ?? new Date()
  const accent = severityColorMap[data.result.severity] ?? '#00d4ff'
  const useCaseLabel = useCaseLabelMap[data.useCase] ?? data.useCase
  const dateStr = ts.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Bottleneck Report — ${data.cpu.name} + ${data.gpu.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:40px;line-height:1.6;font-size:14px}
  @media print{body{padding:0}.no-print{display:none!important}@page{margin:18mm;size:A4}}
  
  /* ── Print button ── */
  .print-btn{position:fixed;top:20px;right:20px;background:${accent};color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px ${accent}55;z-index:999}
  .print-btn:hover{opacity:.9}

  /* ── Header ── */
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:4px solid ${accent};padding-bottom:20px;margin-bottom:30px}
  .logo{font-size:26px;font-weight:900;color:#0a0b0f}
  .logo span{color:${accent}}
  .logo-sub{font-size:12px;color:#999;margin-top:3px}
  .date-block{text-align:right;font-size:12px;color:#666}
  .date-block strong{display:block;font-size:14px;color:#0a0b0f;margin-bottom:3px}

  /* ── Verdict hero ── */
  .verdict{background:#f8f9ff;border-left:6px solid ${accent};padding:24px 28px;border-radius:8px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;gap:20px}
  .verdict-left .tag{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;margin-bottom:6px}
  .verdict-left .title{font-size:28px;font-weight:900;color:${accent};line-height:1}
  .verdict-left .rec{margin-top:10px;font-size:13px;color:#555;max-width:500px}
  .verdict-left .badge{margin-top:14px;display:inline-flex;align-items:center;gap:6px;background:${accent}18;border:1px solid ${accent}44;color:${accent};padding:7px 14px;border-radius:20px;font-size:13px;font-weight:700}
  .pct{text-align:right;flex-shrink:0}
  .pct .num{font-size:80px;font-weight:900;color:${accent};line-height:1;font-family:'Courier New',monospace}
  .pct .lbl{font-size:13px;color:#aaa}

  /* ── Sections ── */
  .section-title{font-size:15px;font-weight:700;color:#0a0b0f;border-bottom:2px solid #eee;padding-bottom:8px;margin:26px 0 14px}
  
  /* ── Grid ── */
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}

  /* ── Spec card ── */
  .spec-card{background:#f8f9ff;border-radius:8px;padding:18px;border:1px solid #e8e8f0}
  .spec-card .card-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-bottom:6px}
  .spec-card .card-name{font-size:17px;font-weight:800;color:#0a0b0f;margin-bottom:12px;line-height:1.3}
  .spec-row{display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid #eee}
  .spec-row:last-child{border-bottom:none}
  .spec-row .lbl{color:#888}
  .spec-row .val{font-weight:600;color:#0a0b0f;font-family:'Courier New',monospace;font-size:11px}
  .spec-row .val.accent{color:${accent}}

  /* ── Util bars ── */
  .util-row{display:flex;align-items:center;gap:12px;margin-bottom:10px}
  .util-lbl{width:220px;font-size:12px;color:#666;flex-shrink:0}
  .bar-bg{flex:1;height:14px;background:#eee;border-radius:7px;overflow:hidden}
  .bar-fill{height:100%;border-radius:7px}
  .util-val{width:48px;text-align:right;font-size:12px;font-weight:700;font-family:'Courier New',monospace}

  /* ── Detail list ── */
  .detail-list{background:#f8f9ff;border-radius:8px;padding:14px 18px;border:1px solid #e8e8f0;margin-bottom:20px}
  .detail-item{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:#444;padding:5px 0;border-bottom:1px solid #eee}
  .detail-item:last-child{border-bottom:none}
  .bullet{color:${accent};font-weight:900;flex-shrink:0;margin-top:1px}

  /* ── Recommendation box ── */
  .rec-box{background:linear-gradient(135deg,#f8f9ff,#fffaf0);border:2px solid ${accent}33;border-radius:8px;padding:18px 20px;margin-bottom:20px}
  .rec-box h3{font-size:13px;font-weight:700;color:#0a0b0f;margin-bottom:8px}
  .rec-box p{font-size:12px;color:#666;margin-bottom:6px}
  .rec-box p:last-child{margin-bottom:0}
  .warn{color:#f5a524!important;font-weight:600}

  /* ── Severity scale ── */
  .scale{display:flex;gap:6px;margin-bottom:20px}
  .scale-item{flex:1;text-align:center;padding:10px 4px;border-radius:6px;font-size:10px}
  .scale-item .range{font-weight:700;font-size:11px;display:block;margin-bottom:3px}
  .scale-item .name{color:#555;font-size:10px}
  .scale-item.active{outline:2px solid currentColor;outline-offset:1px}

  /* ── Footer ── */
  .footer{margin-top:36px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#bbb;text-align:center}
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">⬇ Save as PDF</button>

<div class="header">
  <div>
    <div class="logo">PC<span>Bottleneck</span>.com</div>
    <div class="logo-sub">Free CPU &amp; GPU Bottleneck Analysis Tool</div>
  </div>
  <div class="date-block">
    <strong>Bottleneck Analysis Report</strong>
    ${dateStr}
  </div>
</div>

<div class="verdict">
  <div class="verdict-left">
    <div class="tag">Overall Verdict</div>
    <div class="title">${data.result.label}</div>
    <div class="rec">${data.result.recommendation}</div>
    <span class="badge">⚡ Build Efficiency Score: ${data.result.efficiencyScore}/100</span>
  </div>
  <div class="pct">
    <div class="num">${data.result.percentage}%</div>
    <div class="lbl">bottleneck</div>
  </div>
</div>

<div class="section-title">Component Specifications</div>
<div class="grid-2">
  <div class="spec-card">
    <div class="card-label">CPU — Processor</div>
    <div class="card-name">${data.cpu.name}</div>
    <div class="spec-row"><span class="lbl">Brand</span><span class="val">${data.cpu.brand}</span></div>
    <div class="spec-row"><span class="lbl">Generation</span><span class="val">${data.cpu.generation}</span></div>
    <div class="spec-row"><span class="lbl">Cores / Threads</span><span class="val">${data.cpu.cores}C / ${data.cpu.threads}T</span></div>
    <div class="spec-row"><span class="lbl">Base Clock</span><span class="val">${data.cpu.baseClock} GHz</span></div>
    <div class="spec-row"><span class="lbl">Boost Clock</span><span class="val">${data.cpu.boostClock} GHz</span></div>
    <div class="spec-row"><span class="lbl">TDP</span><span class="val">${data.cpu.tdp}W</span></div>
    <div class="spec-row"><span class="lbl">Socket</span><span class="val">${data.cpu.socket}</span></div>
    <div class="spec-row"><span class="lbl">Release Year</span><span class="val">${data.cpu.releaseYear}</span></div>
    <div class="spec-row"><span class="lbl">Benchmark Score</span><span class="val accent">${data.cpu.benchmarkScore}/100</span></div>
  </div>
  <div class="spec-card">
    <div class="card-label">GPU — Graphics Card</div>
    <div class="card-name">${data.gpu.name}</div>
    <div class="spec-row"><span class="lbl">Brand</span><span class="val">${data.gpu.brand}</span></div>
    <div class="spec-row"><span class="lbl">VRAM</span><span class="val">${data.gpu.vram}GB</span></div>
    <div class="spec-row"><span class="lbl">TDP</span><span class="val">${data.gpu.tdp}W</span></div>
    <div class="spec-row"><span class="lbl">Target Resolution</span><span class="val">${data.gpu.targetResolution}</span></div>
    <div class="spec-row"><span class="lbl">Release Year</span><span class="val">${data.gpu.releaseYear}</span></div>
    <div class="spec-row"><span class="lbl">Benchmark Score</span><span class="val accent">${data.gpu.benchmarkScore}/100</span></div>
    <div class="spec-row"><span class="lbl">System RAM</span><span class="val ${data.ram < 16 ? 'warn' : ''}">${data.ram}GB ${data.ram < 16 ? '⚠ Low' : '✓ OK'}</span></div>
    <div class="spec-row"><span class="lbl">Use Case</span><span class="val">${useCaseLabel}</span></div>
  </div>
</div>

<div class="section-title">Utilization Estimates</div>
<div style="background:#f8f9ff;border-radius:8px;padding:18px 20px;border:1px solid #e8e8f0;margin-bottom:20px">
  <div class="util-row">
    <div class="util-lbl">CPU — ${data.cpu.name}</div>
    <div class="bar-bg"><div class="bar-fill" style="width:${data.result.cpuUtilization}%;background:#00d4ff"></div></div>
    <div class="util-val" style="color:#00d4ff">${data.result.cpuUtilization}%</div>
  </div>
  <div class="util-row">
    <div class="util-lbl">GPU — ${data.gpu.name}</div>
    <div class="bar-bg"><div class="bar-fill" style="width:${data.result.gpuUtilization}%;background:#22d3a0"></div></div>
    <div class="util-val" style="color:#22d3a0">${data.result.gpuUtilization}%</div>
  </div>
  <div class="util-row">
    <div class="util-lbl">Bottleneck Severity</div>
    <div class="bar-bg"><div class="bar-fill" style="width:${data.result.percentage}%;background:${accent}"></div></div>
    <div class="util-val" style="color:${accent}">${data.result.percentage}%</div>
  </div>
  <div class="util-row">
    <div class="util-lbl">Build Efficiency</div>
    <div class="bar-bg"><div class="bar-fill" style="width:${data.result.efficiencyScore}%;background:#9b5de5"></div></div>
    <div class="util-val" style="color:#9b5de5">${data.result.efficiencyScore}%</div>
  </div>
</div>

<div class="section-title">Upgrade Recommendation</div>
<div class="rec-box">
  <h3>🎯 Action Plan</h3>
  <p>${data.result.recommendation}</p>
  ${data.result.bottlenecker !== 'Balanced'
    ? `<p><strong>Priority upgrade:</strong> Your <strong>${data.result.upgradeTarget}</strong> is the limiting component. Upgrading it first gives the best performance-per-dollar improvement.</p>`
    : `<p><strong>Well balanced build!</strong> Invest in faster RAM (DDR5 if on AM5/LGA1700), NVMe SSD, or better cooling for marginal gains.</p>`
  }
  ${data.ram < 16 ? `<p class="warn">⚠ RAM Alert: ${data.ram}GB RAM causes stuttering and frame drops in modern games. Upgrade to 16GB+ for a free performance boost.</p>` : ''}
</div>

<div class="section-title">Technical Analysis Details</div>
<div class="detail-list">
  ${data.result.details.map(d => `<div class="detail-item"><span class="bullet">›</span><span>${d}</span></div>`).join('')}
  <div class="detail-item"><span class="bullet">›</span><span>Bottlenecking component: <strong>${data.result.bottlenecker}</strong></span></div>
  <div class="detail-item"><span class="bullet">›</span><span>Use case weighting applied: ${useCaseLabel}</span></div>
  <div class="detail-item"><span class="bullet">›</span><span>System RAM: ${data.ram}GB ${data.ram >= 32 ? '(Excellent — future-proof)' : data.ram >= 16 ? '(Good — meets modern requirements)' : '(Below recommended — upgrade advised)'}</span></div>
</div>

<div class="section-title">Bottleneck Severity Scale Reference</div>
<div class="scale">
  ${[
    { range: '0–5%',   name: 'No Bottleneck', color: '#00d4ff', sev: 'none' },
    { range: '6–20%',  name: 'Minor',         color: '#22d3a0', sev: 'low' },
    { range: '21–40%', name: 'Moderate',      color: '#f5a524', sev: 'medium' },
    { range: '41–60%', name: 'Significant',   color: '#ef4444', sev: 'high' },
    { range: '61%+',   name: 'Severe',        color: '#ff2056', sev: 'critical' },
  ].map(s => `
    <div class="scale-item ${s.sev === data.result.severity ? 'active' : ''}" style="background:${s.color}18;border:1px solid ${s.color}44;color:${s.color}">
      <span class="range">${s.range}</span>
      <span class="name">${s.name}</span>
    </div>
  `).join('')}
</div>

<div class="footer">
  <p>Generated by PCBottleneck.com — Free CPU &amp; GPU Bottleneck Analysis Tool</p>
  <p style="margin-top:4px">Results are estimates based on benchmark data and weighted formulas. Real-world performance varies by game, driver version, thermals, and system configuration.</p>
  <p style="margin-top:4px">${dateStr}</p>
</div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=960,height=800,scrollbars=yes')
  if (!win) {
    alert('Please allow pop-ups for this site to generate the PDF report.')
    return
  }
  win.document.write(html)
  win.document.close()
  win.focus()
}
