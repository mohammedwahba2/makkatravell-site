<script setup lang="ts">
const { tel, wa } = useSite()
const menuOpen = useState<boolean>('menu-open', () => false)
const atFooter = ref(false)
// hide the bar while the menu is open or the footer is on screen, so it never covers content
onMounted(() => {
  const footer = document.querySelector('footer')
  if (!footer) return
  const io = new IntersectionObserver(([e]) => { atFooter.value = !!e?.isIntersecting }, { threshold: 0.08 })
  io.observe(footer)
  onBeforeUnmount(() => io.disconnect())
})
const hidden = computed(() => menuOpen.value || atFooter.value)
</script>
<template>
  <div class="fixed inset-x-0 bottom-0 z-40 border-t border-brand-200 bg-brand-50/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:hidden"
    :class="hidden ? 'translate-y-full' : 'translate-y-0'" :aria-hidden="hidden">
    <div class="grid grid-cols-3 gap-2">
      <a :href="tel" :tabindex="hidden ? -1 : 0" class="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white text-[14px] font-bold text-brand-800"><span class="i-lucide-phone" />اتصل</a>
      <a :href="wa()" :tabindex="hidden ? -1 : 0" target="_blank" rel="noopener" class="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[14px] font-bold text-white"><span class="i-lucide-message-circle" />واتساب</a>
      <NuxtLink to="/packages" :tabindex="hidden ? -1 : 0" class="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 text-[14px] font-bold text-brand-50"><span class="i-lucide-ticket" />احجز</NuxtLink>
    </div>
  </div>
</template>
