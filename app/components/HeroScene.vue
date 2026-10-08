<script setup lang="ts">
// Illustrated Haram scene inside a pointed arch. Pure SVG: no raster images, loads instantly.
const stars = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 13.3) * 10000; return x - Math.floor(x) }
  return { x: 20 + r(1) * 440, y: 18 + r(2) * 250, r: 0.6 + r(3) * 1.5, d: r(4) * 3 }
})
const root = ref<SVGSVGElement>()
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return
  const layers = [...root.value!.querySelectorAll<SVGGElement>('[data-depth]')]
  const onMove = (e: PointerEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5
    for (const l of layers) { const d = parseFloat(l.dataset.depth!); l.style.transform = `translate3d(${nx * d * -22}px, ${ny * d * -10}px, 0)` }
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('pointermove', onMove))
})
</script>

<template>
  <svg ref="root" viewBox="0 0 480 620" class="h-full w-full" role="img" aria-label="رسم تعبيري للمسجد الحرام والكعبة المشرفة عند الغروب">
    <defs>
      <clipPath id="hs-arch"><path d="M0 620V268C0 150 130 62 240 6C350 62 480 150 480 268V620Z" /></clipPath>
      <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#16100b" /><stop offset=".3" stop-color="#3B2418" /><stop offset=".58" stop-color="#85573B" /><stop offset=".8" stop-color="#D9A27A" /><stop offset="1" stop-color="#F0D3A4" />
      </linearGradient>
      <radialGradient id="hs-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE7B8" stop-opacity=".95" /><stop offset=".45" stop-color="#EBCB84" stop-opacity=".35" /><stop offset="1" stop-color="#EBCB84" stop-opacity="0" /></radialGradient>
      <linearGradient id="hs-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B98A3D" /><stop offset=".5" stop-color="#F3D58B" /><stop offset="1" stop-color="#B98A3D" /></linearGradient>
      <linearGradient id="hs-frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBCB84" /><stop offset=".6" stop-color="#C98F68" /><stop offset="1" stop-color="#85573B" /></linearGradient>
      <linearGradient id="hs-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140c07" stop-opacity="0" /><stop offset="1" stop-color="#140c07" stop-opacity=".92" /></linearGradient>
      <linearGradient id="hs-ray" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFE7B8" stop-opacity=".28" /><stop offset="1" stop-color="#FFE7B8" stop-opacity="0" /></linearGradient>
      <g id="hs-minaret">
        <rect x="-7" y="0" width="14" height="250" fill="#24160e" /><rect x="-7" y="0" width="5" height="250" fill="#2f1d13" />
        <rect x="-11" y="46" width="22" height="7" rx="1.5" fill="#1a0f09" /><rect x="-11" y="104" width="22" height="7" rx="1.5" fill="#1a0f09" />
        <rect x="-8.5" y="-3" width="17" height="6" fill="#1a0f09" /><path d="M-7 -3Q0 -34 7 -3Z" fill="#2a1a10" />
        <rect x="-.9" y="-48" width="1.8" height="24" fill="#EBCB84" /><circle cx="0" cy="-52" r="3.2" fill="none" stroke="#EBCB84" stroke-width="1.3" />
        <g fill="#EBCB84" opacity=".55"><rect x="-1.6" y="64" width="3.2" height="9" rx="1.5" /><rect x="-1.6" y="124" width="3.2" height="9" rx="1.5" /><rect x="-1.6" y="168" width="3.2" height="9" rx="1.5" /></g>
      </g>
    </defs>

    <g clip-path="url(#hs-arch)">
      <rect width="480" height="620" fill="url(#hs-sky)" />
      <!-- stars -->
      <g fill="#F5EFE7"><circle v-for="(s, i) in stars" :key="i" :cx="s.x" :cy="s.y" :r="s.r" class="twinkle" :style="{ animationDelay: `${s.d}s` }" /></g>
      <!-- crescent -->
      <g transform="translate(372 120)" class="drift"><circle r="17" fill="#F5EFE7" /><circle cx="7" cy="-3" r="15" fill="#3B2418" /></g>
      <!-- sunset glow -->
      <circle cx="240" cy="452" r="230" fill="url(#hs-glow)" />
      <path d="M240 452 L110 0 L190 0Z M240 452 L290 0 L370 0Z" fill="url(#hs-ray)" opacity=".6" />

      <g data-depth="0.35" class="[transition:transform_.5s_cubic-bezier(.2,.8,.2,1)]">
        <path d="M-20 470Q50 418 118 452T238 438T352 456T500 424V640H-20Z" fill="#2a190f" opacity=".85" />
        <path d="M-20 492Q80 450 170 482T330 470T500 488V640H-20Z" fill="#1c110a" />
      </g>

      <g data-depth="0.7" class="[transition:transform_.5s_cubic-bezier(.2,.8,.2,1)]">
        <use href="#hs-minaret" x="62" y="262" /><use href="#hs-minaret" x="418" y="262" />
        <use href="#hs-minaret" x="138" y="318" transform="translate(0 0) scale(1)" /><use href="#hs-minaret" x="342" y="318" />
        <!-- central hall + dome -->
        <rect x="170" y="436" width="140" height="92" fill="#1d120b" />
        <path d="M186 436A54 54 0 0 1 294 436Z" fill="#2c1b10" /><path d="M186 436A54 54 0 0 1 240 382V436Z" fill="#37231565" />
        <rect x="239" y="360" width="2" height="24" fill="#EBCB84" /><circle cx="240" cy="356" r="3.5" fill="none" stroke="#EBCB84" stroke-width="1.3" />
        <g fill="#F0D3A4" opacity=".5"><path v-for="i in 7" :key="i" :d="`M${176 + i * 17} 528V498A6 6 0 0 1 ${188 + i * 17} 498V528Z`" /></g>
        <rect x="150" y="528" width="180" height="6" fill="#120a06" />
      </g>

      <g data-depth="1.1" class="[transition:transform_.5s_cubic-bezier(.2,.8,.2,1)]">
        <rect y="534" width="480" height="90" fill="#150d08" />
        <!-- tawaf rings -->
        <ellipse cx="240" cy="580" rx="104" ry="19" fill="none" stroke="#F0D3A4" stroke-width="2.2" stroke-dasharray="1.5 7" stroke-linecap="round" opacity=".7"><animate attributeName="stroke-dashoffset" from="0" to="-85" dur="9s" repeatCount="indefinite" /></ellipse>
        <ellipse cx="240" cy="584" rx="140" ry="26" fill="none" stroke="#F0D3A4" stroke-width="2" stroke-dasharray="1.5 8" stroke-linecap="round" opacity=".42"><animate attributeName="stroke-dashoffset" from="0" to="95" dur="13s" repeatCount="indefinite" /></ellipse>
        <ellipse cx="240" cy="582" rx="78" ry="13" fill="none" stroke="#F0D3A4" stroke-width="2.4" stroke-dasharray="1.5 6" stroke-linecap="round" opacity=".55"><animate attributeName="stroke-dashoffset" from="0" to="-70" dur="7s" repeatCount="indefinite" /></ellipse>
        <!-- Kaaba -->
        <ellipse cx="240" cy="575" rx="64" ry="9" fill="#EBCB84" opacity=".25" />
        <path d="M204 518 L221 508 L293 508 L276 518Z" fill="#241811" />
        <path d="M276 518 L293 508 L293 566 L276 578Z" fill="#070504" />
        <rect x="204" y="518" width="72" height="60" fill="#0d0907" />
        <rect x="204" y="531" width="72" height="7" fill="url(#hs-gold)" /><path d="M276 531 L293 521 V528 L276 538Z" fill="#9c7430" />
        <rect x="229" y="546" width="14" height="26" rx="1" fill="#0d0907" stroke="url(#hs-gold)" stroke-width="1.4" />
      </g>
      <rect y="470" width="480" height="150" fill="url(#hs-fade)" />
    </g>
    <path d="M0 620V268C0 150 130 62 240 6C350 62 480 150 480 268V620" fill="none" stroke="url(#hs-frame)" stroke-width="2.4" />
    <path d="M12 620V270C12 160 138 76 240 24C342 76 468 160 468 270V620" fill="none" stroke="#C98F68" stroke-opacity=".35" stroke-width="1" />
  </svg>
</template>
