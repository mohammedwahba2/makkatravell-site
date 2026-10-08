<script setup lang="ts">
const route = useRoute()
const api = useApi()
const { site, siteUrl, wa } = useSite()
const slug = String(route.params.slug)

const { data: pkg } = await useAsyncData(`pkg-${slug}`, () => api<any>(`/packages/slug/${encodeURIComponent(slug)}`).catch(() => null))
if (!pkg.value) throw createError({ statusCode: 404, statusMessage: 'البرنامج غير موجود', fatal: true })
const { data: related } = await useAsyncData(`related-${slug}`, async () => {
  const r = await api<{ items: any[] }>('/packages', { query: { type: pkg.value.type, limit: 4 } }).catch(() => ({ items: [] as any[] }))
  return r.items.filter((p: any) => p.slug !== slug).slice(0, 3)
}, { default: () => [] as any[] })

const p = computed(() => pkg.value)
const deps = computed<any[]>(() => (p.value.departures ?? []).filter((d: any) => d.isOpen))
const depIdx = ref(Math.max(0, deps.value.findIndex((d) => d.seatsTaken < d.seatsTotal)))
const room = ref('TRIPLE')
const adults = ref(2)
const children = ref(0)
const dep = computed(() => deps.value[depIdx.value])
const unit = (d: any, r: string) => Number(({ DOUBLE: d?.priceDouble, TRIPLE: d?.priceTriple, QUAD: d?.priceQuad } as Record<string, any>)[r] || p.value.basePrice)
const total = computed(() => unit(dep.value, room.value) * adults.value + unit(dep.value, room.value) * 0.75 * children.value)
const seatsLeft = (d: any) => d.seatsTotal - d.seatsTaken
const bookQuery = computed(() => ({ ...(dep.value ? { dep: dep.value.id } : {}), room: room.value, a: adults.value, c: children.value }))
const fromPrice = computed(() => Math.min(Number(p.value.basePrice), ...deps.value.flatMap((d) => [d.priceDouble, d.priceTriple, d.priceQuad]).filter(Boolean).map(Number)))

const facts = computed(() => [
  { i: 'i-lucide-calendar-days', k: 'المدة', v: `${p.value.durationDays} يوم` },
  p.value.nightsMakkah ? { i: 'i-lucide-moon-star', k: 'مكة المكرمة', v: `${p.value.nightsMakkah} ليالٍ` } : null,
  p.value.nightsMadinah ? { i: 'i-lucide-landmark', k: 'المدينة المنورة', v: `${p.value.nightsMadinah} ليالٍ` } : null,
  { i: 'i-lucide-star', k: 'تصنيف الفندق', v: `${p.value.hotelStars} نجوم` },
  p.value.airline ? { i: 'i-lucide-plane', k: 'شركة الطيران', v: p.value.airline } : null,
  { i: 'i-lucide-map-pin', k: 'الانطلاق من', v: p.value.departureCity },
].filter(Boolean) as { i: string; k: string; v: string }[])

const itinerary = computed<any[]>(() => p.value.itinerary ?? [])
const openDay = ref<number | null>(0)
const toggleDay = (i: number) => { openDay.value = openDay.value === i ? null : i }
const lightbox = ref<string | null>(null)
const images = computed(() => [p.value.coverImage, ...(p.value.gallery ?? [])].filter(Boolean) as string[])

usePageSeo(() => ({
  title: p.value.seoTitle || `${p.value.title} من مصر — الأسعار والمواعيد`,
  description: p.value.seoDescription || p.value.summary,
  image: p.value.coverImage,
  breadcrumbs: [{ name: 'البرامج', path: '/packages' }, { name: p.value.title, path: `/packages/${slug}` }],
  jsonLd: [packageSchema(p.value, siteUrl)],
}))
</script>

<template>
  <div v-if="p">
    <section class="relative overflow-hidden bg-brand-950 pb-14 pt-[130px] text-white sm:pt-[150px]">
      <div class="absolute inset-0 opacity-90"><img v-if="p.coverImage" :src="p.coverImage" alt="" class="size-full object-cover" fetchpriority="high" /><CoverArt v-else :seed="p.slug" :kind="p.type" /></div>
      <div class="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-950/40" />
      <div class="wrap relative">
        <nav aria-label="مسار التنقل" class="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-brand-200"><NuxtLink to="/" class="hover:text-white">الرئيسية</NuxtLink><span class="i-lucide-chevron-left text-xs opacity-60" /><NuxtLink to="/packages" class="hover:text-white">البرامج</NuxtLink><span class="i-lucide-chevron-left text-xs opacity-60" /><span class="text-white" aria-current="page">{{ p.title }}</span></nav>
        <div class="mb-4 flex flex-wrap gap-2"><span class="rounded-full bg-white/15 px-4 py-1 text-[13px] font-bold backdrop-blur">{{ PACKAGE_TYPES[p.type] }}</span><span v-if="p.isFeatured" class="inline-flex items-center gap-1 rounded-full bg-gold-400 px-4 py-1 text-[13px] font-bold text-brand-950"><span class="i-lucide-sparkles" />مميز</span></div>
        <h1 class="h-display max-w-3xl !text-white text-[38px] sm:text-[58px]">{{ p.title }}</h1>
        <p class="mt-5 max-w-2xl text-[18px] leading-8 text-brand-100">{{ p.summary }}</p>
        <p class="mt-6 flex items-baseline gap-2"><span class="text-[14px] text-brand-200">يبدأ من</span><span class="num text-[40px] font-bold leading-none">{{ nf(fromPrice) }}</span><span class="text-brand-200">ج.م للفرد</span></p>
      </div>
    </section>

    <div class="wrap grid gap-10 py-14 lg:grid-cols-[1fr_400px] lg:gap-14 lg:py-20">
      <div class="min-w-0 space-y-14">
        <section aria-labelledby="facts">
          <h2 id="facts" class="sr-only">معلومات البرنامج</h2>
          <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3"><li v-for="f in facts" :key="f.k" class="rv flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-[0_18px_40px_-32px_rgb(59_36_24/.35)]"><span class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600"><span :class="f.i" class="text-xl" /></span><div class="min-w-0"><p class="text-[12px] font-semibold text-brand-500">{{ f.k }}</p><p class="truncate text-[15.5px] font-bold text-brand-950">{{ f.v }}</p></div></li></ul>
        </section>

        <section><h2 class="h-display rv text-[30px] sm:text-[36px]">عن البرنامج</h2><p class="rv mt-5 whitespace-pre-line text-[17px] leading-9 text-brand-800">{{ p.description }}</p>
          <ul v-if="p.makkahHotel || p.madinahHotel" class="rv mt-6 grid gap-3 sm:grid-cols-2"><li v-if="p.makkahHotel" class="rounded-2xl bg-white p-5"><p class="text-[12.5px] font-bold text-brand-500">فندق مكة المكرمة</p><p class="mt-1 font-display text-xl">{{ p.makkahHotel }}</p></li><li v-if="p.madinahHotel" class="rounded-2xl bg-white p-5"><p class="text-[12.5px] font-bold text-brand-500">فندق المدينة المنورة</p><p class="mt-1 font-display text-xl">{{ p.madinahHotel }}</p></li></ul>
        </section>

        <section v-if="images.length > 1" aria-label="معرض الصور">
          <h2 class="h-display rv text-[30px] sm:text-[36px]">صور</h2>
          <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"><button v-for="(im, i) in images" :key="im" class="rv group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl" :class="i === 0 ? 'col-span-2 row-span-2 sm:aspect-auto' : ''" :aria-label="`عرض الصورة ${i + 1}`" @click="lightbox = im"><img :src="im" :alt="`${p.title} — صورة ${i + 1}`" loading="lazy" decoding="async" class="size-full object-cover transition-transform duration-700 group-hover:scale-105" /></button></div>
        </section>

        <section v-if="p.includes?.length || p.excludes?.length" class="grid gap-5 sm:grid-cols-2">
          <div v-if="p.includes?.length" class="rv rounded-[22px] bg-white p-7 shadow-[0_18px_40px_-32px_rgb(59_36_24/.35)]"><h2 class="font-display text-[25px]">يشمل البرنامج</h2><ul class="mt-5 space-y-3.5"><li v-for="x in p.includes" :key="x" class="flex items-start gap-3 text-[15.5px] leading-7"><span class="i-lucide-check-circle-2 mt-1 shrink-0 text-xl text-emerald-600" />{{ x }}</li></ul></div>
          <div v-if="p.excludes?.length" class="rv rounded-[22px] bg-white p-7 shadow-[0_18px_40px_-32px_rgb(59_36_24/.35)]"><h2 class="font-display text-[25px]">لا يشمل</h2><ul class="mt-5 space-y-3.5"><li v-for="x in p.excludes" :key="x" class="flex items-start gap-3 text-[15.5px] leading-7 text-brand-700"><span class="i-lucide-circle-x mt-1 shrink-0 text-xl text-brand-300" />{{ x }}</li></ul></div>
        </section>

        <section v-if="itinerary.length">
          <h2 class="h-display rv text-[30px] sm:text-[36px]">برنامج الرحلة</h2>
          <ol class="relative mt-8 space-y-3 before:absolute before:inset-y-3 before:end-[27px] before:w-px before:bg-brand-200">
            <li v-for="(d, i) in itinerary" :key="i" class="rv relative">
              <button class="flex w-full cursor-pointer items-center gap-4 rounded-2xl bg-white p-4 text-start shadow-[0_18px_40px_-34px_rgb(59_36_24/.4)] transition hover:shadow-[0_18px_40px_-26px_rgb(59_36_24/.45)]" :aria-expanded="openDay === i" @click="toggleDay(i)">
                <span class="num relative z-10 grid size-[54px] shrink-0 place-items-center rounded-xl text-center leading-none transition-colors duration-300" :class="openDay === i ? 'bg-brand-900 text-white' : 'bg-brand-100 text-brand-700'"><span><span class="block text-[11px] font-semibold opacity-70">يوم</span><span class="text-xl font-bold">{{ d.day }}</span></span></span>
                <span class="flex-1 font-display text-[21px]">{{ d.title }}</span><span class="i-lucide-chevron-down text-xl text-brand-400 transition-transform duration-300" :class="openDay === i ? 'rotate-180' : ''" />
              </button>
              <div class="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" :style="{ gridTemplateRows: openDay === i ? '1fr' : '0fr' }"><div class="overflow-hidden"><p class="pe-4 ps-[86px] pt-3 text-[16px] leading-8 text-brand-700">{{ d.text }}</p></div></div>
            </li>
          </ol>
        </section>

        <section v-if="deps.length">
          <h2 class="h-display rv text-[30px] sm:text-[36px]">مواعيد السفر والأسعار</h2>
          <div class="rv mt-6 overflow-x-auto rounded-[22px] bg-white shadow-[0_18px_40px_-32px_rgb(59_36_24/.35)]">
            <table class="w-full min-w-[560px] text-[15px]"><thead class="text-[13px] text-brand-500"><tr><th class="p-4 text-start font-bold">تاريخ السفر</th><th class="p-4 text-start font-bold">ثنائية</th><th class="p-4 text-start font-bold">ثلاثية</th><th class="p-4 text-start font-bold">رباعية</th><th class="p-4 text-start font-bold">المقاعد</th></tr></thead>
              <tbody><tr v-for="d in deps" :key="d.id" class="border-t border-brand-100"><td class="p-4 font-bold">{{ fdate(d.date) }}</td><td class="num p-4">{{ nf(unit(d, 'DOUBLE')) }}</td><td class="num p-4">{{ nf(unit(d, 'TRIPLE')) }}</td><td class="num p-4">{{ nf(unit(d, 'QUAD')) }}</td><td class="p-4"><span v-if="seatsLeft(d) > 0" :class="seatsLeft(d) <= 8 ? 'font-bold text-red-600' : 'text-brand-700'">متبقي <b class="num">{{ seatsLeft(d) }}</b></span><span v-else class="font-bold text-brand-400">اكتمل العدد</span></td></tr></tbody></table>
          </div>
          <p class="mt-3 text-[13.5px] text-brand-500">الأسعار بالجنيه المصري للفرد البالغ، وتخضع للتأكيد النهائي من فريقنا عند الحجز.</p>
        </section>
      </div>

      <!-- booking card -->
      <aside class="lg:sticky lg:top-28 lg:self-start" aria-label="احجز هذا البرنامج">
        <div class="rv overflow-hidden rounded-[26px] bg-white shadow-[0_2px_4px_rgb(59_36_24/.05),0_30px_70px_-34px_rgb(59_36_24/.5)]">
          <div class="bg-brand-900 px-7 py-6 text-white"><p class="text-[13px] text-brand-300">إجمالي تقديري</p><p class="num mt-1 text-[38px] font-bold leading-none">{{ nf(total) }}<span class="ms-2 font-sans text-[16px] font-semibold text-brand-300">ج.م</span></p></div>
          <div class="space-y-5 p-7">
            <fieldset v-if="deps.length"><legend class="label">موعد السفر</legend>
              <div class="space-y-2"><label v-for="(d, i) in deps" :key="d.id" class="flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-3.5 transition" :class="[depIdx === i ? 'border-brand-500 bg-brand-50' : 'border-brand-100 hover:border-brand-300', seatsLeft(d) <= 0 ? 'pointer-events-none opacity-50' : '']"><span class="flex items-center gap-3"><input type="radio" name="dep" :checked="depIdx === i" class="size-4 accent-[#A56F4D]" :disabled="seatsLeft(d) <= 0" @change="depIdx = i" /><span class="text-[15px] font-bold">{{ fdate(d.date) }}</span></span><span class="text-[12.5px] font-semibold" :class="seatsLeft(d) <= 8 ? 'text-red-600' : 'text-brand-500'">{{ seatsLeft(d) > 0 ? `متبقي ${seatsLeft(d)}` : 'مكتمل' }}</span></label></div>
            </fieldset>
            <div><label class="label" for="room">نوع الغرفة</label><select id="room" v-model="room" class="input"><option v-for="(l, k) in ROOMS" :key="k" :value="k">{{ l }} — {{ nf(unit(dep, k)) }} ج.م</option></select></div>
            <div class="grid grid-cols-2 gap-3">
              <div><label class="label" for="ad">بالغين</label><div class="flex h-12 items-center justify-between rounded-xl border border-brand-200 px-2"><button type="button" class="grid size-9 cursor-pointer place-items-center rounded-lg text-brand-700 hover:bg-brand-100 disabled:opacity-30" :disabled="adults <= 1" aria-label="إنقاص" @click="adults--"><span class="i-lucide-minus" /></button><span id="ad" class="num text-lg font-bold">{{ adults }}</span><button type="button" class="grid size-9 cursor-pointer place-items-center rounded-lg text-brand-700 hover:bg-brand-100 disabled:opacity-30" :disabled="adults >= 10" aria-label="زيادة" @click="adults++"><span class="i-lucide-plus" /></button></div></div>
              <div><label class="label" for="ch">أطفال</label><div class="flex h-12 items-center justify-between rounded-xl border border-brand-200 px-2"><button type="button" class="grid size-9 cursor-pointer place-items-center rounded-lg text-brand-700 hover:bg-brand-100 disabled:opacity-30" :disabled="children <= 0" aria-label="إنقاص" @click="children--"><span class="i-lucide-minus" /></button><span id="ch" class="num text-lg font-bold">{{ children }}</span><button type="button" class="grid size-9 cursor-pointer place-items-center rounded-lg text-brand-700 hover:bg-brand-100 disabled:opacity-30" :disabled="children >= 10" aria-label="زيادة" @click="children++"><span class="i-lucide-plus" /></button></div></div>
            </div>
            <p v-if="children" class="text-[12.5px] leading-6 text-brand-500">يُحتسب الطفل بنسبة 75% من سعر الفرد.</p>
            <NuxtLink :to="{ path: `/book/${p.slug}`, query: bookQuery }" class="btn-copper w-full" data-magnetic>احجز الآن<span class="i-lucide-arrow-left text-lg" /></NuxtLink>
            <a :href="wa(`السلام عليكم، أريد الاستفسار عن برنامج: ${p.title}`)" target="_blank" rel="noopener" class="btn-line w-full"><span class="i-lucide-message-circle text-lg" />اسأل عبر واتساب</a>
            <p class="flex items-start gap-2 text-[12.5px] leading-6 text-brand-500"><span class="i-lucide-shield-check mt-0.5 shrink-0 text-base text-emerald-600" />إرسال الطلب لا يتطلب دفعًا. يتواصل معك فريقنا لتأكيد الحجز وترتيب الدفع.</p>
          </div>
        </div>
      </aside>
    </div>

    <section v-if="related.length" class="wrap pb-20"><SectionHead eyebrow="قد يهمك أيضًا" title="برامج مشابهة" /><div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"><div v-for="r in related" :key="r.id" class="rv"><PackageCard :pkg="r" /></div></div></section>
    <CtaBand />

    <Teleport to="body"><Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" leave-active-class="transition duration-200" leave-to-class="opacity-0"><div v-if="lightbox" class="fixed inset-0 z-[100] grid place-items-center bg-brand-950/92 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="عرض الصورة" @click="lightbox = null" @keydown.esc="lightbox = null"><button class="absolute end-5 top-5 grid size-12 cursor-pointer place-items-center rounded-full bg-white/10 text-white" aria-label="إغلاق"><span class="i-lucide-x text-2xl" /></button><img :src="lightbox" :alt="p.title" class="max-h-[88vh] max-w-full rounded-2xl object-contain" /></div></Transition></Teleport>
  </div>
</template>
