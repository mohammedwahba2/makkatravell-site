<script setup lang="ts">
const api = useApi()
const { site, wa } = useSite()
const router = useRouter()

const { data } = await useAsyncData('home', async () => {
  const safe = <T>(p: Promise<T>, d: T) => p.catch(() => d)
  const [featured, all, faqs, posts, reviews] = await Promise.all([
    safe(api<{ items: any[] }>('/packages', { query: { featured: true, limit: 6 } }), { items: [] }),
    safe(api<{ items: any[] }>('/packages', { query: { limit: 24 } }), { items: [] }),
    safe(api<any[]>('/faqs'), []),
    safe(api<{ items: any[] }>('/posts', { query: { limit: 3 } }), { items: [] }),
    safe(api<any[]>('/testimonials'), []),
  ])
  return { featured: featured.items, all: all.items, faqs, posts: posts.items, reviews }
}, { default: () => ({ featured: [], all: [], faqs: [], posts: [], reviews: [] }) })

const featured = computed(() => (data.value.featured.length ? data.value.featured : data.value.all).slice(0, 3))
const departures = computed(() =>
  data.value.all.flatMap((p: any) => (p.departures ?? []).filter((d: any) => d.isOpen && d.seatsTaken < d.seatsTotal).map((d: any) => ({ ...d, pkg: p })))
    .sort((a: any, b: any) => +new Date(a.date) - +new Date(b.date)).slice(0, 6))

usePageSeo(() => ({
  rawTitle: true,
  title: 'مكة للسياحة دمياط | برامج عمرة وحج بإشراف ديني وأفضل الأسعار',
  description: 'احجز رحلة عمرتك أو حجك مع مكة للسياحة بدمياط: برامج متنوعة من القاهرة وجميع المحافظات، إقامة بجوار الحرم، تأشيرة وطيران ومرشد ديني. ركّز في عمرتك واترك لنا شرف خدمتك.',
  jsonLd: data.value.faqs.length ? [faqSchema(data.value.faqs.slice(0, 5))] : [],
}))

// quick search
const tab = ref('UMRAH')
const q = ref('')
const tabs = [{ v: 'UMRAH', l: 'عمرة' }, { v: 'HAJJ', l: 'حج' }, { v: 'RELIGIOUS_TOUR', l: 'سياحة دينية' }]
const search = () => router.push({ path: '/packages', query: { type: tab.value, ...(q.value.trim() ? { q: q.value.trim() } : {}) } })

const marquee = ['إشراف ديني مرافق', 'تأشيرة وطيران', 'إقامة قريبة من الحرم', 'مواصلات مكيفة', 'وجبات يومية', 'متابعة قبل السفر وأثناءه', 'حجز بسيط وواضح']

const steps = [
  { i: 'i-lucide-search', t: 'اختر برنامجك', d: 'تصفح برامج العمرة والحج، وقارن المدة والإقامة والأسعار والمواعيد المتاحة.' },
  { i: 'i-lucide-ticket', t: 'أرسل طلب الحجز', d: 'اختر الموعد ونوع الغرفة وعدد الأفراد، وأرسل بياناتك في دقيقتين.' },
  { i: 'i-lucide-phone-call', t: 'نؤكد معك', d: 'يتواصل معك فريقنا لتأكيد البيانات وترتيب الدفع وتجهيز الأوراق والتأشيرة.' },
  { i: 'i-lucide-plane-takeoff', t: 'سافر مطمئنًا', d: 'نرافقك قبل السفر وأثناء الرحلة بإشراف ديني وخدمة متواصلة.' },
]
const why = [
  { i: 'i-lucide-book-open-check', t: 'إشراف ديني مرافق', d: 'مرشد يرافق المجموعة ويشرح المناسك خطوة بخطوة، فتؤدي عمرتك بطمأنينة ووعي.' },
  { i: 'i-lucide-receipt-text', t: 'وضوح كامل في الأسعار', d: 'كل ما يشمله البرنامج وما لا يشمله مكتوب قبل الحجز، دون مفاجآت.' },
  { i: 'i-lucide-hotel', t: 'إقامة مختارة', d: 'فنادق بتصنيفات مختلفة تناسب ميزانيتك، مع بيان واضح لعدد الليالي في مكة والمدينة.' },
  { i: 'i-lucide-file-check-2', t: 'تجهيز الأوراق', d: 'نساعدك في المستندات المطلوبة وإجراءات التأشيرة من أول خطوة.' },
  { i: 'i-lucide-headset', t: 'متابعة مستمرة', d: 'فريق يرد عليك عبر الهاتف وواتساب قبل السفر وأثناء الرحلة.' },
]

// hero intro animation
const hero = ref<HTMLElement>()
onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { default: gsap } = await import('gsap')
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.8 })
      .from('.hero-line', { yPercent: 115, duration: 1.15, stagger: 0.14 }, '-=0.5')
      .from('.hero-sub', { y: 24, opacity: 0, duration: 0.9 }, '-=0.7')
      .from('.hero-cta', { y: 24, opacity: 0, duration: 0.9 }, '-=0.65')
      .from('.hero-search', { y: 40, opacity: 0, duration: 1 }, '-=0.6')
      .from('.hero-scene', { scale: 0.9, opacity: 0, y: 40, duration: 1.5, ease: 'expo.out' }, 0.15)
      .from('.hero-chip', { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.14, ease: 'back.out(1.8)' }, '-=0.8')
  }, hero.value)
  onBeforeUnmount(() => ctx.revert())
})
</script>

<template>
  <div>
    <!-- HERO -->
    <section ref="hero" class="relative isolate overflow-hidden bg-brand-950 text-white">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(1100px_600px_at_20%_105%,rgb(201_143_104/.45),transparent),radial-gradient(800px_500px_at_85%_-10%,rgb(133_87_59/.5),transparent)]" />
      <div class="absolute inset-0 -z-10 star-pattern opacity-80" />
      <div class="wrap grid items-center gap-10 pb-24 pt-[128px] lg:min-h-[100svh] lg:grid-cols-[1.08fr_.92fr] lg:gap-6 lg:pb-28 lg:pt-[110px]">
        <div>
          <p class="hero-eyebrow eyebrow !text-brand-300"><span class="h-px w-10 bg-current opacity-60" />مكة للسياحة · دمياط</p>
          <h1 class="mt-5 font-display text-[40px] font-semibold leading-[1.28] sm:text-[56px] lg:text-[60px] xl:text-[68px]">
            <span class="block overflow-hidden py-1"><span class="hero-line block">ركّز في عمرتك،</span></span>
            <span class="block overflow-hidden py-1"><span class="hero-line block bg-gradient-to-l from-gold-300 via-brand-300 to-brand-400 bg-clip-text text-transparent">واترك لنا شرف خدمتك.</span></span>
          </h1>
          <p class="hero-sub mt-6 max-w-xl text-[18px] leading-9 text-brand-200 sm:text-[19px]">برامج عمرة وحج من القاهرة وجميع المحافظات، بإشراف ديني وإقامة مختارة قريبة من الحرم، وتأشيرة وطيران ومواصلات في رحلة واحدة منظّمة.</p>
          <div class="hero-cta mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap [&>*]:w-full sm:[&>*]:w-auto">
            <NuxtLink to="/umrah" class="btn-copper" data-magnetic>تصفح برامج العمرة<span class="i-lucide-arrow-left text-lg" /></NuxtLink>
            <a :href="wa()" target="_blank" rel="noopener" class="btn-line-light" data-magnetic><span class="i-lucide-message-circle text-lg" />اسأل عبر واتساب</a>
          </div>

          <form class="hero-search mt-12 max-w-xl rounded-[22px] bg-white/[.07] p-2.5 ring-1 ring-white/15 backdrop-blur-xl" @submit.prevent="search">
            <div class="flex gap-1 p-1" role="tablist" aria-label="نوع الرحلة">
              <button v-for="t in tabs" :key="t.v" type="button" role="tab" :aria-selected="tab === t.v" class="flex-1 cursor-pointer rounded-xl py-2.5 text-[14px] font-bold transition-all duration-300" :class="tab === t.v ? 'bg-white text-brand-900 shadow-lg' : 'text-brand-200 hover:text-white'" @click="tab = t.v">{{ t.l }}</button>
            </div>
            <div class="flex gap-2 p-1.5">
              <label class="sr-only" for="hq">ابحث عن برنامج</label>
              <input id="hq" v-model="q" type="search" placeholder="ابحث: عمرة 10 أيام، رمضان…" class="h-12 min-w-0 flex-1 rounded-xl bg-white/10 px-4 text-[15px] text-white outline-none ring-1 ring-white/10 transition placeholder:text-brand-300/80 focus:bg-white/15 focus:ring-brand-400" />
              <button class="btn-copper !h-12 !px-6" type="submit">ابحث</button>
            </div>
          </form>
        </div>

        <div class="relative mx-auto w-full max-w-[460px] lg:max-w-[500px]">
          <div class="hero-scene relative aspect-[480/620] w-full drop-shadow-[0_40px_80px_rgba(0,0,0,.5)]"><HeroScene /></div>
          <div class="hero-chip drift absolute -start-3 top-[18%] flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-brand-900 shadow-2xl sm:-start-10"><span class="grid size-9 place-items-center rounded-xl bg-brand-100 text-brand-600"><span class="i-lucide-book-open-check text-lg" /></span><span class="text-[13px] font-bold leading-tight">مرشد ديني<br /><span class="font-medium text-brand-500">يرافقك طوال الرحلة</span></span></div>
          <div class="hero-chip drift absolute -end-3 bottom-[22%] flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-brand-900 shadow-2xl [animation-delay:-3s] sm:-end-8"><span class="grid size-9 place-items-center rounded-xl bg-brand-100 text-brand-600"><span class="i-lucide-hotel text-lg" /></span><span class="text-[13px] font-bold leading-tight">إقامة مختارة<br /><span class="font-medium text-brand-500">قريبة من الحرم</span></span></div>
        </div>
      </div>
      <div class="absolute inset-x-0 bottom-0 h-10 rounded-t-[44px] bg-brand-50 sm:h-14 sm:rounded-t-[64px]" />
    </section>

    <!-- MARQUEE -->
    <div class="relative overflow-hidden border-y border-brand-200 bg-brand-50 py-5" aria-hidden="true">
      <div class="flex w-max [animation:marquee_38s_linear_infinite] hover:[animation-play-state:paused]">
        <div v-for="n in 2" :key="n" class="flex shrink-0 items-center">
          <span v-for="m in marquee" :key="m + n" class="flex items-center gap-8 px-4 font-display text-[22px] text-brand-700"><span>{{ m }}</span><span class="i-lucide-moon-star text-brand-400" /></span>
        </div>
      </div>
    </div>

    <!-- FEATURED -->
    <section class="wrap pt-24 sm:pt-32">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionHead eyebrow="برامجنا" title="اختر رحلة العمر التي تناسبك" sub="برامج متنوعة في المدة والإقامة والسعر، وكل برنامج يوضح ما يشمله بالتفصيل." />
        <NuxtLink to="/packages" class="btn-line rv">كل البرامج<span class="i-lucide-arrow-left" /></NuxtLink>
      </div>
      <div v-if="featured.length" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"><div v-for="p in featured" :key="p.id" class="rv"><PackageCard :pkg="p" /></div></div>
      <p v-else class="mt-12 rounded-3xl bg-white p-12 text-center text-brand-600">سيتم إضافة البرامج قريبًا. تواصل معنا لمعرفة أحدث العروض.</p>
    </section>

    <!-- DEPARTURES -->
    <section v-if="departures.length" class="wrap pt-24 sm:pt-32">
      <div class="relative overflow-hidden rounded-[32px] bg-brand-900 p-7 text-white star-pattern sm:p-12">
        <div class="pointer-events-none absolute -end-24 -top-24 size-[420px] rounded-full bg-brand-400/20 blur-[80px]" />
        <div class="relative flex flex-wrap items-end justify-between gap-6"><SectionHead light eyebrow="المواعيد القادمة" title="رحلات تنطلق قريبًا" sub="احجز مقعدك قبل اكتمال العدد." /></div>
        <ul class="relative mt-10 grid gap-3 md:grid-cols-2">
          <li v-for="d in departures" :key="d.id" class="rv">
            <NuxtLink :to="`/packages/${d.pkg.slug}`" class="group flex items-center gap-5 rounded-2xl bg-white/[.06] p-5 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/[.12] hover:ring-brand-400/60">
              <div class="grid size-[68px] shrink-0 place-items-center rounded-xl bg-white text-center text-brand-900"><div><p class="num text-2xl font-bold leading-none">{{ new Date(d.date).getDate() }}</p><p class="mt-1 text-[12px] font-bold text-brand-500">{{ new Intl.DateTimeFormat('ar-EG-u-nu-latn', { month: 'short' }).format(new Date(d.date)) }}</p></div></div>
              <div class="min-w-0 flex-1"><p class="truncate font-display text-[20px]">{{ d.pkg.title }}</p><p class="mt-1 text-[13px] text-brand-300">متبقي <b class="num text-white">{{ d.seatsTotal - d.seatsTaken }}</b> مقعد · من <b class="num text-white">{{ nf(d.priceTriple || d.pkg.basePrice) }}</b> ج.م</p></div>
              <span class="i-lucide-arrow-left text-xl text-brand-300 transition-transform duration-300 group-hover:-translate-x-1.5" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- STEPS -->
    <section class="wrap pt-24 sm:pt-32">
      <SectionHead center eyebrow="كيف تحجز" title="أربع خطوات إلى الحرم" sub="عملية واضحة وبسيطة من أول زيارة للموقع حتى يوم السفر." />
      <ol class="relative mt-16 grid gap-6 md:grid-cols-4">
        <div class="pointer-events-none absolute inset-x-[12%] top-[34px] hidden border-t border-dashed border-brand-300 md:block" />
        <li v-for="(s, i) in steps" :key="s.t" class="rv relative text-center">
          <div class="relative z-10 mx-auto grid size-[68px] place-items-center rounded-full bg-brand-900 text-brand-50 shadow-[0_14px_30px_-10px_rgb(59_36_24/.6)]"><span :class="s.i" class="text-[28px]" /><span class="num absolute -end-1 -top-1 grid size-7 place-items-center rounded-full bg-brand-400 text-[13px] font-bold text-brand-950">{{ i + 1 }}</span></div>
          <h3 class="mt-6 font-display text-[22px] text-brand-950">{{ s.t }}</h3>
          <p class="mx-auto mt-2 max-w-[260px] text-[15px] leading-7 text-brand-700/90">{{ s.d }}</p>
        </li>
      </ol>
    </section>

    <!-- WHY -->
    <section class="wrap pt-24 sm:pt-32">
      <div class="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
        <div class="lg:sticky lg:top-32 lg:self-start">
          <SectionHead eyebrow="لماذا مكة للسياحة" title="خدمة تليق بضيف الرحمن" sub="نؤمن أن العمرة رحلة روحية قبل أن تكون رحلة سفر، لذلك نتولى عنك كل التفاصيل لتتفرغ للعبادة." />
          <div class="rv mt-9 flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_18px_40px_-26px_rgb(59_36_24/.3)]">
            <span class="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-900 text-brand-50"><span class="i-lucide-map-pin text-xl" /></span>
            <div><p class="font-display text-lg text-brand-950">مكتبنا في دمياط</p><p class="mt-1 text-[14.5px] leading-7 text-brand-700">{{ site.address }}</p><NuxtLink to="/contact" class="mt-2 inline-flex items-center gap-1.5 text-[14px] font-bold text-brand-600 hover:text-brand-900">الاتجاهات والتواصل<span class="i-lucide-arrow-left" /></NuxtLink></div>
          </div>
        </div>
        <ul class="grid gap-4 sm:grid-cols-2">
          <li v-for="(w, i) in why" :key="w.t" class="rv group rounded-[22px] bg-white p-7 shadow-[0_1px_2px_rgb(59_36_24/.05),0_18px_40px_-28px_rgb(59_36_24/.28)] transition-all duration-500 hover:-translate-y-1 hover:bg-brand-900 hover:text-white" :class="i === 4 ? 'sm:col-span-2' : ''">
            <span class="grid size-12 place-items-center rounded-xl bg-brand-100 text-brand-700 transition-colors duration-500 group-hover:bg-brand-400 group-hover:text-brand-950"><span :class="w.i" class="text-[24px]" /></span>
            <h3 class="mt-5 font-display text-[22px]">{{ w.t }}</h3>
            <p class="mt-2 text-[15px] leading-7 text-brand-700/90 transition-colors duration-500 group-hover:text-brand-200">{{ w.d }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- REVIEWS (only real, published reviews) -->
    <section v-if="data.reviews.length" class="wrap pt-24 sm:pt-32">
      <SectionHead center eyebrow="آراء عملائنا" title="كلمات من ضيوف الرحمن" />
      <div class="mt-12 grid gap-5 md:grid-cols-3"><figure v-for="r in data.reviews.slice(0, 3)" :key="r.id" class="rv rounded-[22px] bg-white p-7 shadow-[0_18px_40px_-28px_rgb(59_36_24/.3)]"><span class="i-lucide-quote text-3xl text-brand-300" /><blockquote class="mt-3 text-[16px] leading-8 text-brand-800">{{ r.text }}</blockquote><figcaption class="mt-5 text-[14px] font-bold text-brand-900">{{ r.name }}<span v-if="r.city" class="font-medium text-brand-500"> — {{ r.city }}</span></figcaption></figure></div>
    </section>

    <!-- BLOG -->
    <section v-if="data.posts.length" class="wrap pt-24 sm:pt-32">
      <div class="flex flex-wrap items-end justify-between gap-6"><SectionHead eyebrow="دليل المعتمر" title="معلومات تهمك قبل السفر" /><NuxtLink to="/blog" class="btn-line rv">كل المقالات<span class="i-lucide-arrow-left" /></NuxtLink></div>
      <div class="mt-12 grid gap-6 md:grid-cols-3"><div v-for="p in data.posts" :key="p.id" class="rv"><PostCard :post="p" /></div></div>
    </section>

    <!-- FAQ -->
    <section v-if="data.faqs.length" class="wrap pt-24 sm:pt-32">
      <div class="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div><SectionHead eyebrow="أسئلة شائعة" title="إجابات سريعة لأكثر ما يسأل عنه المعتمرون" /><NuxtLink to="/faq" class="btn-line rv mt-8">كل الأسئلة<span class="i-lucide-arrow-left" /></NuxtLink></div>
        <div class="rv"><FaqList :items="data.faqs.slice(0, 5)" /></div>
      </div>
    </section>

    <div class="pt-24 sm:pt-32"><CtaBand /></div>
  </div>
</template>
