<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; sub?: string; center?: boolean; light?: boolean }>()
</script>
<template>
  <div :class="center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'">
    <p v-if="eyebrow" class="eyebrow rv" :class="[center ? 'justify-center' : '', light ? '!text-brand-300' : '']"><span class="h-px w-8 bg-current opacity-60" />{{ eyebrow }}<span v-if="center" class="h-px w-8 bg-current opacity-60" /></p>
    <h2 class="h-display rv mt-3 text-[34px] sm:text-[44px]" :class="light ? '!text-white' : ''">{{ title }}</h2>
    <p v-if="sub" class="rv mt-4 text-[17px] leading-8" :class="light ? 'text-brand-200' : 'text-brand-700/90'">{{ sub }}</p>
  </div>
</template>
