<script setup lang="ts">
const { tel, wa } = useSite()
</script>
<template>
  <div class="fixed inset-x-0 bottom-0 z-40 border-t border-brand-200 bg-brand-50/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl md:hidden">
    <div class="grid grid-cols-3 gap-2">
      <a :href="tel" class="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white text-[14px] font-bold text-brand-800"><span class="i-lucide-phone" />اتصل</a>
      <a :href="wa()" target="_blank" rel="noopener" class="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[14px] font-bold text-white"><span class="i-lucide-message-circle" />واتساب</a>
      <NuxtLink to="/packages" class="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 text-[14px] font-bold text-brand-50"><span class="i-lucide-ticket" />احجز</NuxtLink>
    </div>
  </div>
</template>
