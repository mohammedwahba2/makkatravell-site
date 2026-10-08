<script setup lang="ts">
withDefaults(defineProps<{ title?: string; sub?: string }>(), { title: 'جاهز لرحلتك؟ نحجز لك بكل بساطة', sub: 'تواصل معنا الآن وسيرد عليك فريقنا لمساعدتك في اختيار البرنامج الأنسب لك ولأسرتك.' })
const { wa, tel, phoneDisplay } = useSite()
</script>
<template>
  <section class="wrap">
    <div class="relative overflow-hidden rounded-[32px] bg-brand-900 px-7 py-14 text-center text-white star-pattern sm:px-14 sm:py-20">
      <div class="pointer-events-none absolute -top-24 start-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand-400/25 blur-[90px]" />
      <svg class="pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-[900px] max-w-full text-brand-300/20" viewBox="0 0 900 220" fill="none" stroke="currentColor" aria-hidden="true"><path v-for="i in 5" :key="i" :d="`M${450 - i * 78} 220V${150 - i * 8}A${i * 78 + 20} ${i * 78 + 20} 0 0 1 450 ${20 - i * 4}A${i * 78 + 20} ${i * 78 + 20} 0 0 1 ${450 + i * 78} ${150 - i * 8}V220`" /></svg>
      <div class="relative">
        <h2 class="rv mx-auto max-w-2xl font-display text-[34px] leading-[1.25] sm:text-[48px]">{{ title }}</h2>
        <p class="rv mx-auto mt-4 max-w-xl text-[17px] leading-8 text-brand-200">{{ sub }}</p>
        <div class="rv mt-9 flex flex-wrap justify-center gap-3">
          <a :href="wa()" target="_blank" rel="noopener" class="btn bg-[#25D366] text-white hover:shadow-[0_14px_34px_-10px_rgb(37_211_102/.8)]" data-magnetic><span class="i-lucide-message-circle text-xl" />واتساب مباشر</a>
          <a :href="tel" class="btn-line-light" dir="ltr"><span class="i-lucide-phone" />{{ phoneDisplay }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
