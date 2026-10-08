<script setup lang="ts">
const props = defineProps<{ pkg: any }>()
const next = computed(() => (props.pkg.departures ?? []).find((d: any) => d.isOpen && d.seatsTaken < d.seatsTotal))
const left = computed(() => (next.value ? next.value.seatsTotal - next.value.seatsTaken : 0))
const stars = computed(() => Math.max(0, Math.min(5, props.pkg.hotelStars || 0)))
</script>
<template>
  <article class="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgb(59_36_24/.05),0_18px_40px_-24px_rgb(59_36_24/.28)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-26px_rgb(59_36_24/.4)]">
    <NuxtLink :to="`/packages/${pkg.slug}`" class="relative block aspect-[4/3] overflow-hidden" :aria-label="pkg.title">
      <img v-if="pkg.coverImage" :src="pkg.coverImage" :alt="pkg.title" loading="lazy" decoding="async" width="800" height="600" class="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]" />
      <CoverArt v-else :seed="pkg.slug" :kind="pkg.type" class="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]" />
      <div class="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-transparent to-transparent" />
      <span class="absolute start-4 top-4 rounded-full bg-white/92 px-3.5 py-1 text-[12px] font-bold text-brand-800 backdrop-blur">{{ PACKAGE_TYPES[pkg.type] }}</span>
      <span v-if="pkg.isFeatured" class="absolute end-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold-400 px-3 py-1 text-[12px] font-bold text-brand-950"><span class="i-lucide-sparkles text-sm" />مميز</span>
      <span v-if="next && left <= 8" class="absolute bottom-4 start-4 rounded-full bg-red-600/95 px-3 py-1 text-[12px] font-bold text-white">متبقي <b class="num">{{ left }}</b> مقاعد</span>
    </NuxtLink>
    <div class="flex flex-1 flex-col p-6">
      <h3 class="font-display text-[24px] leading-snug text-brand-950"><NuxtLink :to="`/packages/${pkg.slug}`" class="after:absolute after:inset-0">{{ pkg.title }}</NuxtLink></h3>
      <p class="mt-2 line-clamp-2 text-[14.5px] leading-7 text-brand-700/85">{{ pkg.summary }}</p>
      <ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-brand-700">
        <li class="flex items-center gap-1.5"><span class="i-lucide-calendar-days text-brand-400" /><span class="num">{{ pkg.durationDays }}</span> يوم</li>
        <li v-if="pkg.nightsMakkah" class="flex items-center gap-1.5"><span class="i-lucide-moon-star text-brand-400" />مكة <span class="num">{{ pkg.nightsMakkah }}</span> ليالٍ</li>
        <li v-if="pkg.nightsMadinah" class="flex items-center gap-1.5"><span class="i-lucide-landmark text-brand-400" />المدينة <span class="num">{{ pkg.nightsMadinah }}</span> ليالٍ</li>
        <li v-if="stars" class="flex items-center gap-1 text-gold-500"><span v-for="i in stars" :key="i" class="i-lucide-star fill-current text-[13px]" /></li>
      </ul>
      <div class="mt-auto flex items-end justify-between gap-3 border-t border-brand-100 pt-5">
        <div><p class="text-[12px] font-semibold text-brand-500">يبدأ من</p><p class="num text-[26px] font-bold leading-none text-brand-900">{{ nf(pkg.basePrice) }}<span class="ms-1.5 font-sans text-[14px] font-semibold text-brand-600">ج.م</span></p></div>
        <div class="text-end"><p v-if="next" class="text-[12px] text-brand-500">أقرب سفر</p><p v-if="next" class="text-[14px] font-bold text-brand-800">{{ fdateShort(next.date) }}</p></div>
      </div>
    </div>
  </article>
</template>
