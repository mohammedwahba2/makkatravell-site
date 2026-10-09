<script setup lang="ts">
export interface LegalSection { h: string; p?: string[]; ul?: string[]; note?: string }
defineProps<{ eyebrow: string; title: string; intro?: string; updated: string; sections: LegalSection[]; highlights?: string[] }>()
const active = ref('')
const print = () => window.print()
onMounted(() => {
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) active.value = e.target.id }, { rootMargin: '-20% 0px -70% 0px' })
  document.querySelectorAll('[data-legal-section]').forEach((el) => io.observe(el))
  onBeforeUnmount(() => io.disconnect())
})
const others = [{ to: '/privacy', l: 'سياسة الخصوصية' }, { to: '/terms', l: 'الشروط والأحكام' }, { to: '/refund', l: 'الإلغاء والاسترداد' }]
</script>
<template>
  <div>
    <PageHero :eyebrow="eyebrow" :title="title" :sub="intro" :crumbs="[{ name: title }]" />
    <section class="wrap py-14 sm:py-20">
      <div class="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
        <aside class="print:hidden lg:sticky lg:top-28 lg:self-start">
          <p class="eyebrow mb-4">محتويات الصفحة</p>
          <nav aria-label="محتويات الصفحة"><ol class="space-y-0.5 border-s border-brand-200">
            <li v-for="(s, i) in sections" :key="s.h"><a :href="`#s${i + 1}`" class="-ms-px block border-s-2 py-1.5 ps-4 text-[14.5px] leading-6 transition-colors" :class="active === `s${i + 1}` ? 'border-brand-500 font-bold text-brand-950' : 'border-transparent text-brand-600 hover:text-brand-950'"><span class="num me-1.5 text-brand-400">{{ i + 1 }}.</span>{{ s.h }}</a></li>
          </ol></nav>
          <div class="mt-8 flex flex-wrap gap-2"><NuxtLink v-for="o in others" :key="o.to" :to="o.to" class="rounded-full bg-brand-100 px-3.5 py-1.5 text-[13px] font-bold text-brand-800 transition hover:bg-brand-900 hover:text-white">{{ o.l }}</NuxtLink></div>
        </aside>

        <article class="min-w-0 max-w-[780px]">
          <div class="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-brand-200 pb-5 text-[14px] text-brand-500">
            <p>آخر تحديث: <b class="text-brand-800">{{ updated }}</b></p>
            <button class="print:hidden inline-flex cursor-pointer items-center gap-2 font-bold text-brand-700 hover:text-brand-950" @click="print"><span class="i-lucide-printer" />طباعة الصفحة</button>
          </div>

          <div v-if="highlights?.length" class="mb-12 rounded-[22px] bg-brand-900 p-7 text-brand-100 star-pattern">
            <p class="font-display text-[22px] text-white">باختصار</p>
            <ul class="mt-4 space-y-3"><li v-for="h in highlights" :key="h" class="flex items-start gap-3 text-[15.5px] leading-7"><span class="i-lucide-check-circle-2 mt-1 shrink-0 text-lg text-brand-300" />{{ h }}</li></ul>
          </div>

          <section v-for="(s, i) in sections" :id="`s${i + 1}`" :key="s.h" data-legal-section class="mb-11 scroll-mt-28">
            <h2 class="font-display text-[27px] leading-snug text-brand-950"><span class="num me-3 text-brand-300">{{ i + 1 }}.</span>{{ s.h }}</h2>
            <p v-for="t in s.p" :key="t" class="mt-4 text-[17px] leading-9 text-brand-800">{{ t }}</p>
            <ul v-if="s.ul" class="mt-4 space-y-2.5"><li v-for="u in s.ul" :key="u" class="relative ps-7 text-[16.5px] leading-8 text-brand-800"><span class="absolute start-1 top-[15px] size-2 rounded-full bg-brand-400" />{{ u }}</li></ul>
            <p v-if="s.note" class="mt-5 rounded-xl border-s-4 border-brand-400 bg-brand-100 px-5 py-4 text-[15.5px] leading-8 text-brand-800">{{ s.note }}</p>
          </section>

          <div class="mt-14 rounded-[22px] bg-brand-100 p-7 print:hidden"><p class="font-display text-[22px] text-brand-950">لديك سؤال عن هذه الصفحة؟</p><p class="mt-1.5 text-brand-700">نسعد بالرد على أي استفسار.</p><NuxtLink to="/contact" class="btn-dark mt-5">تواصل معنا</NuxtLink></div>
        </article>
      </div>
    </section>
  </div>
</template>
