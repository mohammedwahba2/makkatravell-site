<script setup lang="ts">
defineProps<{ items: { id?: string; question: string; answer: string }[] }>()
const open = ref<number | null>(0)
</script>
<template>
  <div class="divide-y divide-brand-200 rounded-[22px] bg-white px-2 shadow-[0_1px_2px_rgb(59_36_24/.05),0_18px_40px_-28px_rgb(59_36_24/.25)] sm:px-4">
    <div v-for="(f, i) in items" :key="f.id ?? i">
      <h3>
        <button class="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-5 text-start" :aria-expanded="open === i" :aria-controls="`faq-${i}`" @click="open = open === i ? null : i">
          <span class="font-display text-[19px] leading-snug text-brand-950">{{ f.question }}</span>
          <span class="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 transition-all duration-300" :class="open === i ? 'rotate-45 !bg-brand-900 !text-white' : ''"><span class="i-lucide-plus text-lg" /></span>
        </button>
      </h3>
      <div :id="`faq-${i}`" class="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" :style="{ gridTemplateRows: open === i ? '1fr' : '0fr' }">
        <div class="overflow-hidden"><p class="whitespace-pre-line px-4 pb-6 text-[16px] leading-8 text-brand-700">{{ f.answer }}</p></div>
      </div>
    </div>
  </div>
</template>
