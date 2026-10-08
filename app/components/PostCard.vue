<script setup lang="ts">
defineProps<{ post: any }>()
</script>
<template>
  <article class="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgb(59_36_24/.05),0_18px_40px_-28px_rgb(59_36_24/.28)] transition-all duration-500 hover:-translate-y-1.5">
    <div class="relative aspect-[16/10] overflow-hidden">
      <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" loading="lazy" decoding="async" width="800" height="500" class="size-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
      <CoverArt v-else :seed="post.slug" class="transition-transform duration-[900ms] group-hover:scale-105" />
    </div>
    <div class="flex flex-1 flex-col p-6">
      <p class="text-[12.5px] font-bold text-brand-500">{{ post.category }} · {{ fdate(post.publishedAt) }}</p>
      <h3 class="mt-2 font-display text-[22px] leading-snug text-brand-950"><NuxtLink :to="`/blog/${post.slug}`" class="after:absolute after:inset-0">{{ post.title }}</NuxtLink></h3>
      <p class="mt-2 line-clamp-3 text-[15px] leading-7 text-brand-700/85">{{ post.excerpt }}</p>
      <span class="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-bold text-brand-600 transition-colors group-hover:text-brand-900">اقرأ المقال<span class="i-lucide-arrow-left transition-transform group-hover:-translate-x-1" /></span>
    </div>
  </article>
</template>
