<script setup lang="ts">
const { wa } = useSite()
</script>
<template>
  <a :href="wa()" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب"
    class="fixed bottom-6 end-6 z-40 hidden size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-8px_rgb(37_211_102/.7)] transition-transform duration-300 hover:scale-110 md:grid">
    <span class="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s]" />
    <span class="i-lucide-message-circle relative text-[26px]" />
  </a>
</template>
