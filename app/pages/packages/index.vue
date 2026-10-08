<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const api = useApi()
const { siteUrl } = useSite()

const { data } = await useAsyncData('packages-all', () => api<{ items: any[] }>('/packages', { query: { limit: 100 } }).catch(() => ({ items: [] as any[] })), { default: () => ({ items: [] as any[] }) })

const type = ref(String(route.query.type || 'all'))
const q = ref(String(route.query.q || ''))
const sort = ref('featured')
watch([type, q], () => router.replace({ query: { ...(type.value !== 'all' ? { type: type.value } : {}), ...(q.value ? { q: q.value } : {}) } }))

const types = computed(() => ['all', ...new Set(data.value.items.map((p: any) => p.type))])
const items = computed(() => {
  const term = q.value.trim().toLowerCase()
  let list = data.value.items.filter((p: any) => (type.value === 'all' || p.type === type.value) && (!term || `${p.title} ${p.summary}`.toLowerCase().includes(term)))
  const next = (p: any) => +new Date((p.departures ?? [])[0]?.date ?? '2999-01-01')
  if (sort.value === 'price') list = [...list].sort((a: any, b: any) => Number(a.basePrice) - Number(b.basePrice))
  else if (sort.value === 'duration') list = [...list].sort((a: any, b: any) => a.durationDays - b.durationDays)
  else if (sort.value === 'soon') list = [...list].sort((a: any, b: any) => next(a) - next(b))
  return list
})

usePageSeo(() => ({
  title: 'برامج العمرة والحج والسياحة الدينية من مصر',
  description: 'تصفح كل برامج مكة للسياحة بدمياط: عمرة وحج وسياحة دينية بمدد وأسعار مختلفة، مع بيان الإقامة والمواعيد وما يشمله كل برنامج.',
  breadcrumbs: [{ name: 'البرامج', path: '/packages' }],
  jsonLd: data.value.items.length ? [itemListSchema(data.value.items.map((p: any) => ({ name: p.title, path: `/packages/${p.slug}` })), siteUrl)] : [],
}))
</script>

<template>
  <div>
    <PageHero eyebrow="كل البرامج" title="برامج العمرة والحج" sub="اختر المدة والإقامة والموعد، وقارن بين البرامج بكل وضوح." :crumbs="[{ name: 'البرامج' }]" />
    <section class="wrap py-14 sm:py-20">
      <div class="rv mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-2" role="group" aria-label="نوع البرنامج">
          <button v-for="t in types" :key="t" class="h-11 cursor-pointer rounded-full px-5 text-[14.5px] font-bold transition-all duration-300" :class="type === t ? 'bg-brand-900 text-white shadow-[0_10px_24px_-10px_rgb(59_36_24/.6)]' : 'bg-white text-brand-700 hover:bg-brand-100'" @click="type = t">{{ t === 'all' ? 'الكل' : PACKAGE_TYPES[t] }}</button>
        </div>
        <div class="flex gap-3">
          <label class="relative block w-full sm:w-72"><span class="sr-only">بحث</span><span class="i-lucide-search pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-brand-400" /><input v-model="q" type="search" placeholder="ابحث عن برنامج…" class="input !h-11 !rounded-full !ps-11" /></label>
          <label class="sr-only" for="sort">ترتيب</label>
          <select id="sort" v-model="sort" class="input !h-11 !w-auto !rounded-full"><option value="featured">الأبرز</option><option value="soon">الأقرب سفرًا</option><option value="price">الأقل سعرًا</option><option value="duration">الأقصر مدة</option></select>
        </div>
      </div>

      <div v-if="items.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><div v-for="p in items" :key="p.id" class="rv"><PackageCard :pkg="p" /></div></div>
      <div v-else class="rounded-[28px] bg-white px-6 py-20 text-center shadow-[0_18px_40px_-28px_rgb(59_36_24/.25)]">
        <span class="i-lucide-search-x text-5xl text-brand-300" /><h2 class="mt-4 font-display text-3xl">لا توجد نتائج مطابقة</h2><p class="mx-auto mt-3 max-w-md leading-8 text-brand-700">جرّب تغيير الفلتر أو تواصل معنا وسنقترح عليك برنامجًا يناسب موعدك وميزانيتك.</p>
        <button class="btn-dark mt-7" @click="type = 'all'; q = ''">عرض كل البرامج</button>
      </div>
    </section>
    <CtaBand />
  </div>
</template>
