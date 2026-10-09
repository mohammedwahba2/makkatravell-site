<script setup lang="ts">
const api = useApi()
const { site, phoneDisplay, tel, wa } = useSite()
usePageSeo({ title: 'اتصل بنا | عنوان وهاتف مكة للسياحة', description: 'تواصل مع مكة للسياحة: دمياط، طريق المحور، تقسيم المعلمين، أعلى معارض النماس للموبيليات، الدور الأول. هاتف وواتساب وفيسبوك وإنستجرام وتيك توك.', breadcrumbs: [{ name: 'اتصل بنا', path: '/contact' }] })
const f = reactive({ name: '', phone: '', subject: '', message: '', website: '' })
const errors = reactive<Record<string, string>>({})
const busy = ref(false)
const sent = ref(false)
const apiError = ref('')
async function submit() {
  Object.keys(errors).forEach((k) => delete errors[k]); apiError.value = ''
  if (f.website) return
  if (f.name.trim().length < 2) errors.name = 'اكتب اسمك'
  if (!isEgMobile(f.phone)) errors.phone = 'أدخل رقم موبايل صحيح'
  if (f.message.trim().length < 5) errors.message = 'اكتب رسالتك'
  if (Object.keys(errors).length) return
  busy.value = true
  try { await api('/inquiries', { method: 'POST', body: { name: f.name.trim(), phone: normalizePhone(f.phone), ...(f.subject.trim() ? { subject: f.subject.trim() } : {}), message: f.message.trim() } }); sent.value = true; track('inquiry_submit', { page: 'contact' }) }
  catch (e) { apiError.value = errMsg(e) } finally { busy.value = false }
}
const map = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(`مكة للسياحة، ${site.value.address}`)}&hl=ar&z=16&output=embed`)
const mapLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`مكة للسياحة ${site.value.address}`)}`)
const socials = computed(() => [['facebook', 'i-simple-icons-facebook', 'فيسبوك'], ['instagram', 'i-simple-icons-instagram', 'إنستجرام'], ['tiktok', 'i-simple-icons-tiktok', 'تيك توك'], ['youtube', 'i-simple-icons-youtube', 'يوتيوب']].filter((s) => (site.value.social as any)[s[0]!]).map((s) => ({ href: (site.value.social as any)[s[0]!], icon: s[1]!, label: s[2]! })))
</script>
<template>
  <div>
    <PageHero eyebrow="اتصل بنا" title="يسعدنا سماعك" sub="اتصل أو راسلنا على واتساب أو زر مكتبنا في." :crumbs="[{ name: 'اتصل بنا' }]" />
    <section class="wrap py-16 sm:py-24">
      <div class="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div class="min-w-0 space-y-4">
          <a :href="tel" class="rv group flex min-w-0 items-center gap-4 rounded-[22px] bg-white p-6 shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)] transition hover:-translate-y-1"><span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-900 text-brand-50"><span class="i-lucide-phone-call text-2xl" /></span><div class="min-w-0"><p class="text-[13px] font-bold text-brand-500">اتصل بنا</p><p class="num text-[22px] font-bold sm:text-[26px]" dir="ltr">{{ phoneDisplay }}</p></div></a>
          <a :href="wa()" target="_blank" rel="noopener" class="rv group flex min-w-0 items-center gap-4 rounded-[22px] bg-white p-6 shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)] transition hover:-translate-y-1"><span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#25D366] text-white"><span class="i-lucide-message-circle text-2xl" /></span><div class="min-w-0"><p class="text-[13px] font-bold text-brand-500">واتساب</p><p class="text-[20px] font-bold">ابدأ محادثة الآن</p></div></a>
          <div class="rv flex items-start gap-5 rounded-[22px] bg-white p-6 shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)]"><span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700"><span class="i-lucide-map-pin text-2xl" /></span><div><p class="text-[13px] font-bold text-brand-500">عنوان المكتب</p><address class="mt-1 text-[16.5px] font-semibold not-italic leading-8">{{ site.address }}</address><a :href="mapLink" target="_blank" rel="noopener" class="mt-2 inline-flex items-center gap-1.5 text-[14px] font-bold text-brand-600 hover:text-brand-900">افتح في خرائط جوجل<span class="i-lucide-arrow-up-left" /></a></div></div>
          <div v-if="socials.length" class="rv flex items-center gap-3 rounded-[22px] bg-white p-6 shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)]"><span class="me-2 text-[15px] font-bold">تابعنا</span><a v-for="s in socials" :key="s.href" :href="s.href" target="_blank" rel="noopener noreferrer me" :aria-label="s.label" class="grid size-11 place-items-center rounded-full bg-brand-100 text-brand-800 transition hover:bg-brand-900 hover:text-white"><span :class="s.icon" class="text-lg" /></a></div>
        </div>

        <div class="rv rounded-[26px] bg-white p-7 shadow-[0_30px_70px_-40px_rgb(59_36_24/.45)] sm:p-10">
          <div v-if="sent" class="py-10 text-center"><span class="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"><span class="i-lucide-check text-5xl" /></span><h2 class="mt-6 font-display text-[30px]">وصلتنا رسالتك</h2><p class="mt-3 leading-8 text-brand-700">شكرًا لتواصلك، سيرد عليك فريقنا في أقرب وقت.</p></div>
          <form v-else class="space-y-5" novalidate @submit.prevent="submit">
            <h2 class="font-display text-[28px]">أرسل لنا رسالة</h2>
            <div class="grid gap-5 sm:grid-cols-2"><div><label class="label" for="cn">الاسم *</label><input id="cn" v-model="f.name" class="input" autocomplete="name" /><p v-if="errors.name" class="mt-1.5 text-[13px] font-semibold text-red-600">{{ errors.name }}</p></div><div><label class="label" for="cp">رقم الموبايل *</label><input id="cp" v-model="f.phone" class="input num" dir="ltr" inputmode="tel" autocomplete="tel" /><p v-if="errors.phone" class="mt-1.5 text-[13px] font-semibold text-red-600">{{ errors.phone }}</p></div></div>
            <div><label class="label" for="cs">الموضوع</label><input id="cs" v-model="f.subject" class="input" placeholder="استفسار عن عمرة رمضان…" /></div>
            <div><label class="label" for="cm">رسالتك *</label><textarea id="cm" v-model="f.message" rows="5" maxlength="1800" class="input !h-auto py-3 leading-7" /><p v-if="errors.message" class="mt-1.5 text-[13px] font-semibold text-red-600">{{ errors.message }}</p></div>
            <div class="absolute -start-[9999px]" aria-hidden="true"><label>الموقع<input v-model="f.website" tabindex="-1" autocomplete="off" /></label></div>
            <p v-if="apiError" class="rounded-xl bg-red-50 p-3.5 text-[14.5px] font-semibold text-red-700" role="alert">{{ apiError }}</p>
            <button class="btn-dark w-full" :disabled="busy"><span v-if="busy" class="i-lucide-loader-circle animate-spin text-lg" /><template v-else>إرسال الرسالة<span class="i-lucide-send" /></template></button>
          </form>
        </div>
      </div>
      <div class="rv mt-10 overflow-hidden rounded-[26px] shadow-[0_30px_70px_-40px_rgb(59_36_24/.45)]"><iframe :src="map" title="موقع مكتب مكة للسياحة على الخريطة" class="h-[380px] w-full border-0 sm:h-[460px]" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen /></div>
    </section>
  </div>
</template>
