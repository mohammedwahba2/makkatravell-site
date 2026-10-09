<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; sub?: string; crumbs?: { name: string; to?: string }[] }>()
</script>
<template>
  <section class="relative overflow-hidden bg-brand-950 pb-16 pt-[140px] text-white star-pattern sm:pb-20 sm:pt-[170px]">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_85%_-10%,rgb(201_143_104/.35),transparent)]" />
    <svg class="pointer-events-none absolute -bottom-px start-1/2 w-[min(1100px,140%)] -translate-x-1/2 text-brand-400/25" viewBox="0 0 1000 200" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <path v-for="i in 6" :key="i" :d="`M${500 - i * 82} 200V${130 - i * 6}A${i * 82 + 20} ${i * 82 + 20} 0 0 1 500 ${-i * 4 - 10}A${i * 82 + 20} ${i * 82 + 20} 0 0 1 ${500 + i * 82} ${130 - i * 6}V200`" />
    </svg>
    <div class="wrap relative">
      <nav v-if="crumbs?.length" aria-label="مسار التنقل" class="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-brand-300">
        <NuxtLink to="/" class="hover:text-white">الرئيسية</NuxtLink>
        <template v-for="c in crumbs" :key="c.name"><span class="i-lucide-chevron-left text-xs opacity-60" /><NuxtLink v-if="c.to" :to="c.to" class="hover:text-white">{{ c.name }}</NuxtLink><span v-else class="text-white/90" aria-current="page">{{ c.name }}</span></template>
      </nav>
      <!-- <p v-if="eyebrow" class="eyebrow !text-brand-300"><span class="h-px w-8 bg-current opacity-60" />{{ eyebrow }}</p> -->
      <h1 class="h-display mt-3 max-w-3xl !text-white text-[40px] sm:text-[58px]">{{ title }}</h1>
      <p v-if="sub" class="mt-5 max-w-2xl text-[18px] leading-8 text-brand-200">{{ sub }}</p>
      <div class="mt-8 empty:hidden"><slot /></div>
    </div>
  </section>
</template>
