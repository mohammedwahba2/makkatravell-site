<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; updated: string; sections: { h: string; p: string[] }[] }>()
</script>
<template>
  <div>
    <PageHero :eyebrow="eyebrow" :title="title" :crumbs="[{ name: title }]" />
    <section class="wrap max-w-[820px] py-14 sm:py-20">
      <p class="mb-10 text-[14px] text-brand-500">آخر تحديث: {{ updated }}</p>
      <div v-for="(s, i) in sections" :key="s.h" class="rv mb-10">
        <h2 class="font-display text-[28px] text-brand-950"><span class="num me-3 text-brand-300">{{ i + 1 }}.</span>{{ s.h }}</h2>
        <p v-for="t in s.p" :key="t" class="mt-4 text-[17px] leading-9 text-brand-800">{{ t }}</p>
      </div>
    </section>
  </div>
</template>
