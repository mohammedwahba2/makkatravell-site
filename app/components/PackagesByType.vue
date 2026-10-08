<script setup lang="ts">
const props = defineProps<{ type: string; empty: string }>()
const api = useApi()
const { data } = await useAsyncData(`packages-${props.type}`, () => api<{ items: any[] }>('/packages', { query: { type: props.type, limit: 50 } }).catch(() => ({ items: [] as any[] })), { default: () => ({ items: [] as any[] }) })
</script>
<template>
  <div v-if="data.items.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><div v-for="p in data.items" :key="p.id" class="rv"><PackageCard :pkg="p" /></div></div>
  <div v-else class="rounded-[28px] bg-white px-6 py-16 text-center text-brand-700 shadow-[0_18px_40px_-28px_rgb(59_36_24/.25)]"><span class="i-lucide-calendar-clock text-4xl text-brand-300" /><p class="mx-auto mt-4 max-w-md leading-8">{{ empty }}</p></div>
</template>
