<script setup lang="ts">
const route = useRoute()
const api = useApi()
const { wa } = useSite()
const slug = String(route.params.slug)
usePageSeo({ title: 'احجز برنامجك', description: 'أرسل طلب حجزك في دقيقتين وسيتواصل معك فريق مكة للسياحة لتأكيده.', noindex: true })

const { data: p } = await useAsyncData(`book-${slug}`, () => api<any>(`/packages/slug/${encodeURIComponent(slug)}`).catch(() => null))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'البرنامج غير موجود', fatal: true })

const deps = computed<any[]>(() => (p.value.departures ?? []).filter((d: any) => d.isOpen))
const qDep = String(route.query.dep || '')
const f = reactive({
  departureId: deps.value.find((d) => d.id === qDep)?.id ?? deps.value.find((d) => d.seatsTaken < d.seatsTotal)?.id ?? '',
  roomType: ['DOUBLE', 'TRIPLE', 'QUAD'].includes(String(route.query.room)) ? String(route.query.room) : 'TRIPLE',
  adults: Math.min(10, Math.max(1, Number(route.query.a) || 2)),
  children: Math.min(10, Math.max(0, Number(route.query.c) || 0)),
  fullName: '', phone: '', email: '', nationalId: '', notes: '', website: '',
})
const dep = computed(() => deps.value.find((d) => d.id === f.departureId))
const unit = computed(() => Number(({ DOUBLE: dep.value?.priceDouble, TRIPLE: dep.value?.priceTriple, QUAD: dep.value?.priceQuad } as Record<string, any>)[f.roomType] || p.value.basePrice))
const total = computed(() => unit.value * f.adults + unit.value * 0.75 * f.children)
const left = computed(() => (dep.value ? dep.value.seatsTotal - dep.value.seatsTaken : 99))

const step = ref(1)
const errors = reactive<Record<string, string>>({})
const busy = ref(false)
const apiError = ref('')
const done = ref<{ reference: string; totalPrice: string } | null>(null)

function validate(s: number) {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (s === 1) {
    if (deps.value.length && !f.departureId) errors.departureId = 'اختر موعد السفر'
    if (f.adults + f.children > left.value) errors.adults = `المقاعد المتاحة في هذا الموعد ${left.value} فقط`
  }
  if (s === 2) {
    if (f.fullName.trim().split(/\s+/).length < 2) errors.fullName = 'اكتب الاسم ثنائيًا على الأقل'
    if (!isEgMobile(f.phone)) errors.phone = 'أدخل رقم موبايل مصري صحيح (مثال: 01012345678)'
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) errors.email = 'البريد الإلكتروني غير صحيح'
    if (f.nationalId && !/^\d{14}$/.test(normalizePhone(f.nationalId))) errors.nationalId = 'الرقم القومي يتكون من 14 رقمًا'
  }
  return Object.keys(errors).length === 0
}
const next = () => { if (validate(step.value)) { step.value++; window.scrollTo({ top: 0, behavior: 'smooth' }) } }
const back = () => { step.value--; window.scrollTo({ top: 0, behavior: 'smooth' }) }

async function submit() {
  if (f.website) return // honeypot
  if (!validate(1) || !validate(2)) { step.value = Object.keys(errors).some((k) => ['departureId', 'adults'].includes(k)) ? 1 : 2; return }
  busy.value = true; apiError.value = ''
  try {
    const r = await api<{ reference: string; totalPrice: string }>('/bookings', { method: 'POST', body: {
      packageId: p.value.id, ...(f.departureId ? { departureId: f.departureId } : {}), fullName: f.fullName.trim(), phone: normalizePhone(f.phone),
      ...(f.email ? { email: f.email.trim() } : {}), ...(f.nationalId ? { nationalId: normalizePhone(f.nationalId) } : {}),
      adults: f.adults, children: f.children, roomType: f.roomType, ...(f.notes.trim() ? { notes: f.notes.trim() } : {}),
    } })
    done.value = r
    try { localStorage.setItem('mk_last_booking', JSON.stringify({ reference: r.reference, phone: normalizePhone(f.phone) })) } catch { /* private mode */ }
    window.scrollTo({ top: 0 })
  } catch (e) { apiError.value = errMsg(e) } finally { busy.value = false }
}
const copied = ref(false)
const copy = async () => { try { await navigator.clipboard.writeText(done.value!.reference); copied.value = true; setTimeout(() => (copied.value = false), 2000) } catch { /* ignore */ } }
const steps = ['البرنامج', 'بياناتك', 'المراجعة']
</script>

<template>
  <div class="min-h-[80vh] bg-brand-50 pb-28 pt-[110px] sm:pt-[130px]">
    <div class="wrap max-w-[980px]">
      <!-- SUCCESS -->
      <div v-if="done" class="mx-auto max-w-xl rounded-[30px] bg-white p-8 text-center shadow-[0_30px_70px_-34px_rgb(59_36_24/.5)] sm:p-12">
        <div class="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 [animation:pop_.7s_cubic-bezier(.2,1.4,.4,1)_both]"><span class="i-lucide-check text-5xl" /></div>
        <h1 class="mt-6 font-display text-[34px]">تم استلام طلب حجزك</h1>
        <p class="mt-3 leading-8 text-brand-700">شكرًا لثقتك بنا. سيتواصل معك فريقنا قريبًا على رقم <b class="num" dir="ltr">{{ normalizePhone(f.phone) }}</b> لتأكيد الحجز وترتيب الدفع.</p>
        <div class="mt-8 rounded-2xl bg-brand-50 p-5"><p class="text-[13px] font-bold text-brand-500">رقم حجزك</p><div class="mt-1 flex items-center justify-center gap-3"><b class="num text-[30px] tracking-wider text-brand-900" dir="ltr">{{ done.reference }}</b><button class="grid size-10 cursor-pointer place-items-center rounded-full bg-white text-brand-600 shadow" :aria-label="copied ? 'تم النسخ' : 'نسخ'" @click="copy"><span :class="copied ? 'i-lucide-check text-emerald-600' : 'i-lucide-copy'" /></button></div><p class="mt-2 text-[13px] text-brand-500">احتفظ به لتتبع حالة حجزك</p></div>
        <dl class="mt-6 space-y-3 text-start text-[15px]"><div class="flex justify-between border-b border-brand-100 pb-3"><dt class="text-brand-500">البرنامج</dt><dd class="font-bold">{{ p.title }}</dd></div><div v-if="dep" class="flex justify-between border-b border-brand-100 pb-3"><dt class="text-brand-500">موعد السفر</dt><dd class="font-bold">{{ fdate(dep.date) }}</dd></div><div class="flex justify-between"><dt class="text-brand-500">الإجمالي التقديري</dt><dd class="num font-bold">{{ nf(done.totalPrice) }} ج.م</dd></div></dl>
        <div class="mt-9 grid gap-3 sm:grid-cols-2"><a :href="wa(`السلام عليكم، قدّمت طلب حجز رقم ${done.reference}`)" target="_blank" rel="noopener" class="btn bg-[#25D366] text-white"><span class="i-lucide-message-circle text-lg" />أرسل رقم الحجز واتساب</a><NuxtLink to="/track" class="btn-line">تتبع الحجز</NuxtLink></div>
        <NuxtLink to="/" class="mt-6 inline-block text-[14px] font-bold text-brand-600 hover:text-brand-900">العودة للرئيسية</NuxtLink>
      </div>

      <template v-else>
        <div class="mb-10"><NuxtLink :to="`/packages/${p.slug}`" class="inline-flex items-center gap-2 text-[14px] font-bold text-brand-600 hover:text-brand-900"><span class="i-lucide-arrow-right" />العودة للبرنامج</NuxtLink><h1 class="h-display mt-3 text-[34px] sm:text-[46px]">احجز: {{ p.title }}</h1></div>

        <ol class="mb-10 flex items-center gap-2" aria-label="خطوات الحجز"><template v-for="(s, i) in steps" :key="s"><li class="flex items-center gap-3" :aria-current="step === i + 1 ? 'step' : undefined"><span class="num grid size-10 place-items-center rounded-full text-[15px] font-bold transition-all duration-500" :class="step > i + 1 ? 'bg-emerald-600 text-white' : step === i + 1 ? 'bg-brand-900 text-white shadow-[0_10px_24px_-8px_rgb(59_36_24/.6)]' : 'bg-brand-100 text-brand-500'"><span v-if="step > i + 1" class="i-lucide-check" /><template v-else>{{ i + 1 }}</template></span><span class="hidden text-[15px] font-bold sm:block" :class="step >= i + 1 ? 'text-brand-900' : 'text-brand-400'">{{ s }}</span></li><li v-if="i < steps.length - 1" class="h-px flex-1 bg-brand-200" aria-hidden="true"><span class="block h-full bg-emerald-600 transition-all duration-700" :style="{ width: step > i + 1 ? '100%' : '0%' }" /></li></template></ol>

        <div class="grid gap-8 lg:grid-cols-[1fr_330px]">
          <form class="rounded-[26px] bg-white p-6 shadow-[0_30px_70px_-40px_rgb(59_36_24/.45)] sm:p-9" novalidate @submit.prevent="step < 3 ? next() : submit()">
            <Transition mode="out-in" enter-active-class="transition duration-400 ease-out" enter-from-class="opacity-0 translate-x-6" leave-active-class="transition duration-200" leave-to-class="opacity-0 -translate-x-6">
              <div v-if="step === 1" key="s1" class="space-y-7">
                <h2 class="font-display text-[26px]">اختر الموعد والغرفة</h2>
                <fieldset v-if="deps.length"><legend class="label">موعد السفر</legend><div class="grid gap-2.5 sm:grid-cols-2"><label v-for="d in deps" :key="d.id" class="flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-4 transition" :class="[f.departureId === d.id ? 'border-brand-500 bg-brand-50' : 'border-brand-100 hover:border-brand-300', d.seatsTotal - d.seatsTaken <= 0 ? 'pointer-events-none opacity-45' : '']"><span class="flex items-center gap-3"><input v-model="f.departureId" type="radio" :value="d.id" class="size-4 accent-[#A56F4D]" /><span class="font-bold">{{ fdate(d.date) }}</span></span><span class="text-[12.5px] font-semibold text-brand-500">{{ d.seatsTotal - d.seatsTaken > 0 ? `متبقي ${d.seatsTotal - d.seatsTaken}` : 'مكتمل' }}</span></label></div><p v-if="errors.departureId" class="mt-2 text-[13px] font-semibold text-red-600">{{ errors.departureId }}</p></fieldset>
                <p v-else class="rounded-xl bg-brand-50 p-4 text-[15px] leading-7 text-brand-700">لا توجد مواعيد محددة حاليًا لهذا البرنامج. أرسل طلبك وسنتواصل معك بالمواعيد المتاحة.</p>
                <div><span class="label">نوع الغرفة</span><div class="grid gap-2.5 sm:grid-cols-3"><label v-for="(l, k) in ROOMS" :key="k" class="cursor-pointer rounded-xl border-2 p-4 text-center transition" :class="f.roomType === k ? 'border-brand-500 bg-brand-50' : 'border-brand-100 hover:border-brand-300'"><input v-model="f.roomType" type="radio" :value="k" class="sr-only" /><span class="block font-bold">{{ l }}</span><span class="num mt-1 block text-[13px] text-brand-500">{{ nf(Number(({ DOUBLE: dep?.priceDouble, TRIPLE: dep?.priceTriple, QUAD: dep?.priceQuad } as Record<string, any>)[k] || p.basePrice)) }} ج.م</span></label></div></div>
                <div class="grid grid-cols-2 gap-4"><div><label class="label" for="a">عدد البالغين</label><input id="a" v-model.number="f.adults" type="number" min="1" max="10" class="input num" /></div><div><label class="label" for="c">عدد الأطفال</label><input id="c" v-model.number="f.children" type="number" min="0" max="10" class="input num" /></div></div>
                <p v-if="errors.adults" class="text-[13px] font-semibold text-red-600">{{ errors.adults }}</p>
              </div>

              <div v-else-if="step === 2" key="s2" class="space-y-5">
                <h2 class="font-display text-[26px]">بياناتك للتواصل</h2>
                <div><label class="label" for="n">الاسم بالكامل *</label><input id="n" v-model="f.fullName" class="input" autocomplete="name" placeholder="كما في جواز السفر" :aria-invalid="!!errors.fullName" /><p v-if="errors.fullName" class="mt-1.5 text-[13px] font-semibold text-red-600">{{ errors.fullName }}</p></div>
                <div class="grid gap-5 sm:grid-cols-2"><div><label class="label" for="p">رقم الموبايل *</label><input id="p" v-model="f.phone" class="input num" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="01012345678" :aria-invalid="!!errors.phone" /><p v-if="errors.phone" class="mt-1.5 text-[13px] font-semibold text-red-600">{{ errors.phone }}</p></div><div><label class="label" for="e">البريد الإلكتروني (اختياري)</label><input id="e" v-model="f.email" type="email" class="input" dir="ltr" autocomplete="email" /><p v-if="errors.email" class="mt-1.5 text-[13px] font-semibold text-red-600">{{ errors.email }}</p></div></div>
                <div><label class="label" for="nid">الرقم القومي (اختياري)</label><input id="nid" v-model="f.nationalId" class="input num" dir="ltr" inputmode="numeric" maxlength="14" /><p v-if="errors.nationalId" class="mt-1.5 text-[13px] font-semibold text-red-600">{{ errors.nationalId }}</p></div>
                <div><label class="label" for="no">ملاحظات (اختياري)</label><textarea id="no" v-model="f.notes" rows="3" maxlength="800" class="input !h-auto py-3 leading-7" placeholder="أي طلبات خاصة، كبار سن، تفضيلات للغرف…" /></div>
                <div class="absolute -start-[9999px]" aria-hidden="true"><label>الموقع<input v-model="f.website" tabindex="-1" autocomplete="off" /></label></div>
              </div>

              <div v-else key="s3" class="space-y-6">
                <h2 class="font-display text-[26px]">راجع طلبك</h2>
                <dl class="divide-y divide-brand-100 rounded-2xl bg-brand-50 px-5 text-[15px]"><div v-for="r in [['البرنامج', p.title], ['موعد السفر', dep ? fdate(dep.date) : 'سيتم التحديد مع فريقنا'], ['الغرفة', ROOMS[f.roomType]], ['الأفراد', `${f.adults} بالغ${f.children ? ` + ${f.children} طفل` : ''}`], ['الاسم', f.fullName], ['الموبايل', normalizePhone(f.phone)], ...(f.email ? [['البريد', f.email]] : [])]" :key="r[0]" class="flex justify-between gap-4 py-3.5"><dt class="text-brand-500">{{ r[0] }}</dt><dd class="font-bold">{{ r[1] }}</dd></div></dl>
                <div class="flex items-center justify-between rounded-2xl bg-brand-900 px-6 py-5 text-white"><span class="text-brand-200">الإجمالي التقديري</span><span class="num text-[30px] font-bold">{{ nf(total) }} <span class="font-sans text-base font-semibold text-brand-300">ج.م</span></span></div>
                <p class="flex items-start gap-2.5 text-[13.5px] leading-7 text-brand-600"><span class="i-lucide-shield-check mt-1 shrink-0 text-lg text-emerald-600" />لا يتم أي دفع الآن. بإرسال الطلب أنت توافق على <NuxtLink to="/terms" target="_blank" class="font-bold underline">الشروط والأحكام</NuxtLink> و<NuxtLink to="/privacy" target="_blank" class="font-bold underline">سياسة الخصوصية</NuxtLink>.</p>
                <p v-if="apiError" class="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-[14.5px] font-semibold text-red-700" role="alert"><span class="i-lucide-circle-alert mt-0.5 shrink-0 text-lg" />{{ apiError }}</p>
              </div>
            </Transition>

            <div class="mt-9 flex items-center justify-between gap-3 border-t border-brand-100 pt-6">
              <button v-if="step > 1" type="button" class="btn-line !h-12" @click="back"><span class="i-lucide-arrow-right" />السابق</button><span v-else />
              <button class="btn-dark !h-12 min-w-[160px]" :disabled="busy" type="submit"><span v-if="busy" class="i-lucide-loader-circle animate-spin text-lg" /><template v-else>{{ step < 3 ? 'التالي' : 'إرسال طلب الحجز' }}<span :class="step < 3 ? 'i-lucide-arrow-left' : 'i-lucide-send'" /></template></button>
            </div>
          </form>

          <aside class="hidden lg:block"><div class="sticky top-28 overflow-hidden rounded-[24px] bg-white shadow-[0_30px_70px_-40px_rgb(59_36_24/.45)]"><div class="aspect-[16/10]"><img v-if="p.coverImage" :src="p.coverImage" :alt="p.title" class="size-full object-cover" /><CoverArt v-else :seed="p.slug" :kind="p.type" /></div><div class="space-y-3 p-6"><h3 class="font-display text-[22px]">{{ p.title }}</h3><p class="text-[14px] text-brand-600"><span class="num">{{ p.durationDays }}</span> يوم · {{ PACKAGE_TYPES[p.type] }}</p><div class="border-t border-brand-100 pt-4"><div class="flex justify-between text-[14px]"><span class="text-brand-500">سعر الفرد</span><b class="num">{{ nf(unit) }} ج.م</b></div><div class="mt-2 flex justify-between"><span class="text-brand-500">الإجمالي</span><b class="num text-[22px] text-brand-900">{{ nf(total) }} ج.م</b></div></div></div></div></aside>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
@keyframes pop { from { transform: scale(.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
