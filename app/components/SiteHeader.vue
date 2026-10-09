<script setup lang="ts">
const route = useRoute()
const { phoneDisplay, tel } = useSite()
const nav = [
  { to: '/', label: 'الرئيسية' }, { to: '/umrah', label: 'العمرة' }, { to: '/hajj', label: 'الحج' }, { to: '/packages', label: 'كل البرامج' },
  { to: '/services', label: 'خدماتنا' }, { to: '/blog', label: 'المدونة' }, { to: '/about', label: 'من نحن' }, { to: '/contact', label: 'اتصل بنا' },
]
const darkHero = computed(() => ['/', '/umrah', '/hajj'].includes(route.path))
const scrolled = ref(false)
const hidden = ref(false)
const open = useState<boolean>('menu-open', () => false)
let last = 0
onMounted(() => {
  const on = () => {
    const y = window.scrollY
    scrolled.value = y > 40
    hidden.value = y > 420 && y > last + 4 && !open.value ? true : y < last - 4 ? false : hidden.value
    last = y
  }
  window.addEventListener('scroll', on, { passive: true }); on()
  onBeforeUnmount(() => window.removeEventListener('scroll', on))
})
watch(() => route.fullPath, () => { open.value = false })
watch(open, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })
const light = computed(() => darkHero.value && !scrolled.value && !open.value)
const active = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 transition-all duration-500" :class="[hidden ? '-translate-y-full' : 'translate-y-0', light ? 'bg-transparent' : 'bg-brand-50/90 shadow-[0_1px_0_rgb(232_220_203/.9)] backdrop-blur-xl']">
    <div class="wrap flex h-[76px] items-center justify-between gap-6">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="مكة للسياحة — الرئيسية">
        <img src="/logo-sm.webp" alt="شعار مكة للسياحة" width="46" height="46" fetchpriority="high" decoding="async" class="h-11 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,.25)]" />
        <span class="leading-tight">
          <span class="block font-display text-[21px] font-semibold transition-colors" :class="light ? 'text-white' : 'text-brand-900'">مكة للسياحة</span>
          <span class="block text-[11px] font-semibold tracking-[.2em] transition-colors" :class="light ? 'text-brand-300' : 'text-brand-500'">MAKKA TRAVEL</span>
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
        <NuxtLink v-for="n in nav.slice(0, 7)" :key="n.to" :to="n.to" class="group relative rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors"
          :class="[light ? 'text-white/85 hover:text-white' : 'text-brand-700 hover:text-brand-950', active(n.to) ? (light ? '!text-white' : '!text-brand-950') : '']">
          {{ n.label }}
          <span class="absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-center scale-x-0 rounded-full bg-brand-400 transition-transform duration-300 group-hover:scale-x-100" :class="active(n.to) ? '!scale-x-100' : ''" />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <a :href="tel" class="num hidden items-center gap-2 text-[15px] font-bold xl:flex" :class="light ? 'text-white' : 'text-brand-800'" dir="ltr"><span class="i-lucide-phone-call text-brand-400" />{{ phoneDisplay }}</a>
        <NuxtLink to="/packages" class="btn-copper hidden !h-11 !px-6 sm:inline-flex" data-magnetic>احجز الآن</NuxtLink>
        <button class="grid size-11 place-items-center rounded-full lg:hidden" :class="light ? 'bg-white/10 text-white' : 'bg-brand-100 text-brand-900'" :aria-expanded="open" aria-label="القائمة" @click="open = !open">
          <span :class="open ? 'i-lucide-x' : 'i-lucide-menu'" class="text-2xl" />
        </button>
      </div>
    </div>
  </header>

  <!-- mobile menu -->
  <Transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 -translate-y-4" leave-active-class="transition duration-300" leave-to-class="opacity-0 -translate-y-2">
    <div v-if="open" class="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-brand-950 pb-12 pt-[92px] lg:hidden star-pattern">
      <nav class="wrap flex flex-col py-6" aria-label="القائمة">
        <NuxtLink v-for="(n, i) in nav" :key="n.to" :to="n.to" class="flex items-center justify-between border-b border-white/10 py-4 font-display text-[28px] text-brand-100" :style="{ animation: `rise .6s ${i * 0.05}s both cubic-bezier(.2,.8,.2,1)` }" :class="active(n.to) ? '!text-brand-300' : ''">
          {{ n.label }}<span class="i-lucide-arrow-up-left text-brand-400" />
        </NuxtLink>
        <a :href="tel" class="btn-copper mt-8" dir="ltr"><span class="i-lucide-phone" />{{ phoneDisplay }}</a>
      </nav>
    </div>
  </Transition>
</template>

<style>
@keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
</style>
