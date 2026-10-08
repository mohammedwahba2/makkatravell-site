<script setup lang="ts">
const api = useApi()
const { wa } = useSite()
usePageSeo({ title: 'تتبع حجزك', description: 'تابع حالة حجزك مع مكة للسياحة برقم الحجز ورقم الموبايل.', noindex: true })
const f = reactive({ reference: '', phone: '' })
const busy = ref(false)
const error = ref('')
const res = ref<any>(null)
onMounted(() => { try { const s = JSON.parse(localStorage.getItem('mk_last_booking') || 'null'); if (s) { f.reference = s.reference; f.phone = s.phone } } catch { /* ignore */ } })

async function submit() {
  error.value = ''; res.value = null
  if (!isEgMobile(f.phone)) return void (error.value = 'أدخل رقم الموبايل الذي حجزت به')
  busy.value = true
  try { res.value = await api('/bookings/track', { method: 'POST', body: { reference: f.reference.trim().toUpperCase(), phone: normalizePhone(f.phone) } }) }
  catch (e) { error.value = errMsg(e) } finally { busy.value = false }
}
const stages = [{ k: 'PENDING', l: 'تم استلام الطلب', i: 'i-lucide-inbox' }, { k: 'CONFIRMED', l: 'تم تأكيد الحجز', i: 'i-lucide-badge-check' }, { k: 'COMPLETED', l: 'اكتملت الرحلة', i: 'i-lucide-plane-landing' }]
const stageIdx = computed(() => (res.value ? stages.findIndex((s) => s.k === res.value.status) : -1))
const remaining = computed(() => (res.value ? Math.max(0, Number(res.value.totalPrice) - Number(res.value.paidAmount)) : 0))
</script>

<template>
  <div class="min-h-[80vh] pb-28 pt-[120px] sm:pt-[150px]">
    <div class="wrap max-w-[780px]">
      <p class="eyebrow justify-center"><span class="h-px w-8 bg-current opacity-60" />تتبع الحجز<span class="h-px w-8 bg-current opacity-60" /></p>
      <h1 class="h-display mt-3 text-center text-[38px] sm:text-[52px]">أين وصل حجزك؟</h1>
      <form class="mx-auto mt-10 grid gap-4 rounded-[26px] bg-white p-6 shadow-[0_30px_70px_-40px_rgb(59_36_24/.45)] sm:grid-cols-2 sm:p-8" @submit.prevent="submit">
        <div><label class="label" for="r">رقم الحجز</label><input id="r" v-model="f.reference" class="input num uppercase" dir="ltr" placeholder="MK-XXXXXXX" required /></div>
        <div><label class="label" for="ph">رقم الموبايل</label><input id="ph" v-model="f.phone" class="input num" dir="ltr" inputmode="tel" placeholder="01012345678" required /></div>
        <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-[14.5px] font-semibold text-red-700 sm:col-span-2" role="alert">{{ error }}</p>
        <button class="btn-dark sm:col-span-2" :disabled="busy"><span v-if="busy" class="i-lucide-loader-circle animate-spin text-lg" /><template v-else>تتبع الحجز<span class="i-lucide-search" /></template></button>
      </form>

      <Transition enter-active-class="transition duration-500" enter-from-class="opacity-0 translate-y-6">
        <div v-if="res" class="mx-auto mt-8 overflow-hidden rounded-[26px] bg-white shadow-[0_30px_70px_-40px_rgb(59_36_24/.45)]">
          <div class="flex flex-wrap items-center justify-between gap-3 bg-brand-900 px-7 py-5 text-white"><div><p class="text-[12.5px] text-brand-300">رقم الحجز</p><p class="num text-[22px] font-bold tracking-wider" dir="ltr">{{ res.reference }}</p></div><span class="rounded-full bg-white/15 px-4 py-1.5 text-[14px] font-bold">{{ BOOKING_STATUS[res.status] }}</span></div>
          <div class="p-7">
            <ol v-if="res.status !== 'CANCELLED'" class="mb-8 grid grid-cols-3 gap-2"><li v-for="(s, i) in stages" :key="s.k" class="text-center"><span class="mx-auto grid size-12 place-items-center rounded-full transition-all duration-700" :class="i <= stageIdx ? 'bg-emerald-600 text-white' : 'bg-brand-100 text-brand-400'"><span :class="s.i" class="text-xl" /></span><span class="mt-2 block text-[13px] font-bold" :class="i <= stageIdx ? 'text-brand-900' : 'text-brand-400'">{{ s.l }}</span></li></ol>
            <p v-else class="mb-6 rounded-xl bg-red-50 p-4 font-bold text-red-700">تم إلغاء هذا الحجز. للاستفسار تواصل معنا.</p>
            <dl class="divide-y divide-brand-100 text-[15px]"><div v-for="r in [['الاسم', res.fullName], ['البرنامج', res.package.title], ['موعد السفر', res.departure ? fdate(res.departure.date) : 'قيد التحديد'], ['الغرفة', ROOMS[res.roomType]], ['الأفراد', `${res.adults} بالغ${res.children ? ` + ${res.children} طفل` : ''}`], ['حالة الدفع', PAYMENT_STATUS[res.paymentStatus]]]" :key="r[0]" class="flex justify-between gap-4 py-3.5"><dt class="text-brand-500">{{ r[0] }}</dt><dd class="font-bold">{{ r[1] }}</dd></div></dl>
            <div class="mt-5 grid grid-cols-3 gap-3 text-center"><div class="rounded-2xl bg-brand-50 p-4"><p class="text-[12px] text-brand-500">الإجمالي</p><p class="num mt-1 font-bold">{{ nf(res.totalPrice) }}</p></div><div class="rounded-2xl bg-brand-50 p-4"><p class="text-[12px] text-brand-500">المدفوع</p><p class="num mt-1 font-bold text-emerald-700">{{ nf(res.paidAmount) }}</p></div><div class="rounded-2xl bg-brand-50 p-4"><p class="text-[12px] text-brand-500">المتبقي</p><p class="num mt-1 font-bold text-brand-600">{{ nf(remaining) }}</p></div></div>
            <a :href="wa(`السلام عليكم، بخصوص حجز رقم ${res.reference}`)" target="_blank" rel="noopener" class="btn-line mt-7 w-full"><span class="i-lucide-message-circle" />تواصل بخصوص هذا الحجز</a>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
