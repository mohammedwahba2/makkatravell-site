<script setup lang="ts">
// Branded placeholder cover for packages without a photo. Variant is derived from the slug so each card is stable.
const props = defineProps<{ seed: string; kind?: string }>()
const h = computed(() => [...props.seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7))
const v = computed(() => (props.kind === 'HAJJ' ? 3 : h.value % 3))
const skies = [['#2a1a10', '#85573B', '#E2B98E'], ['#1f2a22', '#4a6a58', '#E8D2A6'], ['#2b1d2a', '#8a5a57', '#F0C9A0'], ['#241811', '#5C3A28', '#D9A27A']]
const sky = computed(() => skies[v.value]!)
const uid = computed(() => `ca${h.value}`)
</script>
<template>
  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient :id="`${uid}s`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" :stop-color="sky[0]" /><stop offset=".55" :stop-color="sky[1]" /><stop offset="1" :stop-color="sky[2]" /></linearGradient>
      <radialGradient :id="`${uid}g`"><stop offset="0" stop-color="#FFE7B8" stop-opacity=".8" /><stop offset="1" stop-color="#FFE7B8" stop-opacity="0" /></radialGradient>
    </defs>
    <rect width="400" height="300" :fill="`url(#${uid}s)`" />
    <circle :cx="v === 1 ? 110 : 290" cy="190" r="110" :fill="`url(#${uid}g)`" />
    <g fill="#F5EFE7" opacity=".8"><circle cx="40" cy="36" r="1.2" /><circle cx="120" cy="22" r="1" /><circle cx="210" cy="48" r="1.3" /><circle cx="330" cy="30" r="1" /><circle cx="365" cy="74" r="1.2" /><circle cx="80" cy="84" r="1" /></g>
    <path d="M-10 214Q70 180 150 204T300 196T420 186V300H-10Z" fill="#22140c" opacity=".75" />
    <!-- skyline by variant -->
    <g fill="#190f09">
      <template v-if="v === 0 || v === 3">
        <rect x="52" y="108" width="9" height="130" /><path d="M50 108Q56.5 90 63 108Z" /><rect x="55.5" y="76" width="2" height="18" fill="#EBCB84" />
        <rect x="338" y="108" width="9" height="130" /><path d="M336 108Q342.5 90 349 108Z" /><rect x="341.5" y="76" width="2" height="18" fill="#EBCB84" />
        <rect x="136" y="170" width="128" height="70" /><path d="M150 170A50 50 0 0 1 250 170Z" /><rect x="199" y="108" width="2" height="18" fill="#EBCB84" />
        <rect x="178" y="226" width="44" height="40" fill="#0b0705" /><rect x="178" y="236" width="44" height="5" fill="#C99A4B" />
      </template>
      <template v-else-if="v === 1">
        <rect x="60" y="120" width="8" height="120" /><path d="M58 120Q64 104 70 120Z" /><rect x="333" y="120" width="8" height="120" /><path d="M331 120Q337 104 343 120Z" />
        <rect x="110" y="178" width="180" height="62" /><path d="M162 178A38 38 0 0 1 238 178Z" fill="#2f6b52" /><rect x="199" y="124" width="2" height="16" fill="#EBCB84" />
        <g fill="#EBCB84" opacity=".5"><path v-for="i in 6" :key="i" :d="`M${116 + i * 25} 240V214A6 6 0 0 1 ${128 + i * 25} 214V240Z`" /></g>
      </template>
      <template v-else>
        <g><path v-for="i in 5" :key="i" :d="`M${40 + (i - 1) * 78} 250V150A39 39 0 0 1 ${118 + (i - 1) * 78} 150V250Z`" fill="none" stroke="#190f09" stroke-width="10" /></g>
        <rect x="0" y="236" width="400" height="64" />
      </template>
    </g>
    <rect y="236" width="400" height="64" fill="#140c07" opacity=".85" />
  </svg>
</template>
