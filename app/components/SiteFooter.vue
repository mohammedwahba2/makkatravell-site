<script setup lang="ts">
const { site, phoneDisplay, tel, wa } = useSite()
const cols = [
  { title: 'برامجنا', links: [{ to: '/umrah', label: 'برامج العمرة' }, { to: '/hajj', label: 'برامج الحج' }, { to: '/packages', label: 'كل البرامج' }, { to: '/track', label: 'تتبع حجزك' }] },
  { title: 'الشركة', links: [{ to: '/about', label: 'من نحن' }, { to: '/services', label: 'خدماتنا' }, { to: '/blog', label: 'المدونة' }, { to: '/faq', label: 'الأسئلة الشائعة' }, { to: '/contact', label: 'اتصل بنا' }] },
]
const socials = computed(() => [
  { k: 'facebook', icon: 'i-simple-icons-facebook', label: 'فيسبوك' }, { k: 'instagram', icon: 'i-simple-icons-instagram', label: 'إنستجرام' },
  { k: 'tiktok', icon: 'i-simple-icons-tiktok', label: 'تيك توك' }, { k: 'youtube', icon: 'i-simple-icons-youtube', label: 'يوتيوب' },
].filter((s) => (site.value.social as Record<string, string | undefined>)[s.k]).map((s) => ({ ...s, href: (site.value.social as Record<string, string>)[s.k]! })))
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative mt-24 overflow-hidden bg-brand-950 text-brand-200 star-pattern">
    <div class="pointer-events-none absolute inset-x-0 top-0 hairline" />
    <div class="wrap relative grid grid-cols-2 gap-x-6 gap-y-12 pb-28 pt-16 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-12 lg:pb-16 lg:pt-20">
      <div class="col-span-2 lg:col-span-1">
        <NuxtLink to="/" class="flex items-center gap-3"><img src="/logo-sm.webp" alt="شعار مكة للسياحة" width="56" height="56" class="h-14 w-auto" loading="lazy" /><span class="font-display text-[26px] text-white">مكة للسياحة</span></NuxtLink>
        <p class="mt-5 max-w-sm font-display text-[22px] leading-[1.6] text-brand-300">{{ site.tagline }}</p>
        <div class="mt-7 flex gap-2.5">
          <a v-for="s in socials" :key="s.k" :href="s.href" target="_blank" rel="noopener noreferrer me" :aria-label="s.label" class="grid size-11 place-items-center rounded-full border border-white/15 text-brand-100 transition hover:border-brand-400 hover:bg-brand-400 hover:text-brand-950"><span :class="s.icon" class="text-lg" /></a>
        </div>
      </div>
      <div v-for="c in cols" :key="c.title">
        <h3 class="mb-5 font-display text-xl text-white">{{ c.title }}</h3>
        <ul class="space-y-3"><li v-for="l in c.links" :key="l.to"><NuxtLink :to="l.to" class="text-[15px] transition hover:text-white hover:ps-1">{{ l.label }}</NuxtLink></li></ul>
      </div>
      <div class="col-span-2 lg:col-span-1">
        <h3 class="mb-5 font-display text-xl text-white">تواصل معنا</h3>
        <ul class="space-y-4 text-[15px]">
          <li class="flex gap-3"><span class="i-lucide-map-pin mt-1 text-brand-400" /><span class="leading-7">{{ site.address }}</span></li>
          <li><a :href="tel" class="flex items-center gap-3 transition hover:text-white" dir="ltr" style="justify-content:flex-end"><span class="num font-bold text-white">{{ phoneDisplay }}</span><span class="i-lucide-phone text-brand-400" /></a></li>
          <li><a :href="wa()" target="_blank" rel="noopener" class="flex items-center gap-3 transition hover:text-white"><span class="i-lucide-message-circle text-brand-400" />واتساب مباشر</a></li>
          <li v-if="site.email"><a :href="`mailto:${site.email}`" class="flex items-center gap-3 transition hover:text-white"><span class="i-lucide-mail text-brand-400" /><span dir="ltr">{{ site.email }}</span></a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="wrap flex flex-col items-center justify-between gap-3 py-6 text-[13px] text-brand-300 sm:flex-row">
        <p>© <span class="num">{{ year }}</span> مكة للسياحة — دمياط. جميع الحقوق محفوظة.<span v-if="site.licenseNumber" class="mx-2 text-brand-400">·</span><span v-if="site.licenseNumber">{{ site.licenseAuthority || 'رقم الترخيص' }}: <b class="num text-brand-100">{{ site.licenseNumber }}</b></span></p>
        <div class="flex flex-wrap justify-center gap-x-5 gap-y-2"><NuxtLink to="/privacy" class="hover:text-white">سياسة الخصوصية</NuxtLink><NuxtLink to="/terms" class="hover:text-white">الشروط والأحكام</NuxtLink><NuxtLink to="/refund" class="hover:text-white">الإلغاء والاسترداد</NuxtLink></div>
      </div>
    </div>
  </footer>
</template>
