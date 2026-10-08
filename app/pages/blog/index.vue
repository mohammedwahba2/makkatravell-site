<script setup lang="ts">
const api = useApi()
const { siteUrl } = useSite()
const { data } = await useAsyncData('posts-all', () => api<{ items: any[] }>('/posts', { query: { limit: 50 } }).catch(() => ({ items: [] as any[] })), { default: () => ({ items: [] as any[] }) })
usePageSeo(() => ({ title: 'مدونة العمرة والحج | أدلة ونصائح قبل السفر', description: 'مقالات وأدلة عملية عن العمرة والحج: المناسك، المستندات، النصائح قبل السفر وأثناءه، من فريق مكة للسياحة بدمياط.', breadcrumbs: [{ name: 'المدونة', path: '/blog' }], jsonLd: data.value.items.length ? [itemListSchema(data.value.items.map((p: any) => ({ name: p.title, path: `/blog/${p.slug}` })), siteUrl)] : [] }))
</script>
<template>
  <div>
    <PageHero eyebrow="المدونة" title="دليل المعتمر والحاج" sub="مقالات عملية تساعدك على الاستعداد لرحلتك." :crumbs="[{ name: 'المدونة' }]" />
    <section class="wrap py-16 sm:py-24"><div v-if="data.items.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><div v-for="p in data.items" :key="p.id" class="rv"><PostCard :post="p" /></div></div><p v-else class="rounded-3xl bg-white p-14 text-center text-brand-700">لا توجد مقالات منشورة بعد.</p></section>
    <CtaBand />
  </div>
</template>
