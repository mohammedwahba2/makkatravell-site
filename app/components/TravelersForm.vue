<script setup lang="ts">
const props = defineProps<{ reference: string; phone: string; booking: any }>()
const emit = defineEmits<{ refresh: [] }>()
const api = useApi()
const n = computed(() => props.booking.requiredTravelers as number)
interface Row { fullName: string; gender: string; birthDate: string; passportNo: string; passportExpiry: string; nationality: string }
const rows = ref<Row[]>([])
const d = (v?: string | null) => (v ? new Date(v).toISOString().slice(0, 10) : '')
watch(() => props.booking, (b) => {
  rows.value = Array.from({ length: n.value }, (_, i) => { const p = b.passengers?.[i]; return { fullName: p?.fullName ?? '', gender: p?.gender ?? 'M', birthDate: d(p?.birthDate), passportNo: p?.passportNo ?? '', passportExpiry: d(p?.passportExpiry), nationality: p?.nationality ?? 'مصري' } })
}, { immediate: true })
const docsOf = (i: number) => (props.booking.documents ?? []).filter((x: any) => x.passengerIx === i)
const saving = ref(false)
const msg = ref<{ ok: boolean; t: string } | null>(null)
const uploading = ref<number | null>(null)
const today = new Date().toISOString().slice(0, 10)

async function save() {
  msg.value = null
  const filled = rows.value.map((r, i) => ({ r, i })).filter(({ r }) => r.fullName.trim())
  if (!filled.length) return void (msg.value = { ok: false, t: 'اكتب اسم مسافر واحد على الأقل' })
  const last = filled[filled.length - 1]!.i
  for (let i = 0; i <= last; i++) if (!rows.value[i]!.fullName.trim()) return void (msg.value = { ok: false, t: `اكتب اسم المسافر رقم ${i + 1} أو رتّب الأسماء بدون صفوف فارغة` })
  saving.value = true
  try {
    await api('/bookings/travelers', { method: 'POST', body: { reference: props.reference, phone: props.phone, passengers: rows.value.slice(0, last + 1).map((r) => ({ fullName: r.fullName.trim(), gender: r.gender, ...(r.birthDate ? { birthDate: r.birthDate } : {}), ...(r.passportNo ? { passportNo: r.passportNo.trim() } : {}), ...(r.passportExpiry ? { passportExpiry: r.passportExpiry } : {}), ...(r.nationality ? { nationality: r.nationality } : {}) })) } })
    msg.value = { ok: true, t: 'تم حفظ بيانات المسافرين. شكرًا لك.' }; emit('refresh')
  } catch (e) { msg.value = { ok: false, t: errMsg(e) } } finally { saving.value = false }
}
async function pick(i: number, e: Event) {
  const input = e.target as HTMLInputElement; const f = input.files?.[0]; if (!f) return
  if (!props.booking.passengers?.[i]) { msg.value = { ok: false, t: 'احفظ بيانات المسافر أولًا ثم ارفع صورة الجواز' }; input.value = ''; return }
  uploading.value = i; msg.value = null
  try {
    const fd = new FormData(); fd.append('reference', props.reference); fd.append('phone', props.phone); fd.append('kind', 'PASSPORT'); fd.append('passengerIx', String(i)); fd.append('file', await compressImage(f))
    await api('/bookings/documents', { method: 'POST', body: fd }); msg.value = { ok: true, t: 'تم رفع صورة الجواز' }; emit('refresh')
  } catch (x) { msg.value = { ok: false, t: errMsg(x) } } finally { uploading.value = null; input.value = '' }
}
</script>

<template>
  <section class="mt-10 overflow-hidden rounded-[26px] bg-white">
    <div class="border-b border-brand-100 bg-brand-50 px-7 py-5">
      <h2 class="font-display text-[24px]">بيانات المسافرين</h2>
      <p class="mt-1 text-[14px] leading-7 text-brand-600">نحتاجها لتجهيز التأشيرة. اكتب الاسم كما في جواز السفر. يمكنك الحفظ على مراحل والعودة لاحقًا.</p>
    </div>
    <form class="space-y-5 p-6 sm:p-7" @submit.prevent="save">
      <div v-for="(r, i) in rows" :key="i" class="rounded-2xl border border-brand-200 p-5">
        <div class="mb-4 flex items-center justify-between gap-3"><p class="font-bold text-brand-900"><span class="num me-2 inline-grid size-7 place-items-center rounded-full bg-brand-900 text-[13px] text-white">{{ i + 1 }}</span>المسافر {{ i + 1 }}</p>
          <span v-if="docsOf(i).length" class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12.5px] font-bold text-emerald-700"><span class="i-lucide-check-circle-2" />تم رفع الجواز</span></div>
        <div class="grid gap-4 sm:grid-cols-6">
          <div class="sm:col-span-3"><label class="label" :for="`n${i}`">الاسم كما في الجواز</label><input :id="`n${i}`" v-model="r.fullName" class="input" autocomplete="off" /></div>
          <div class="sm:col-span-1"><label class="label" :for="`g${i}`">النوع</label><select :id="`g${i}`" v-model="r.gender" class="input"><option value="M">ذكر</option><option value="F">أنثى</option></select></div>
          <div class="sm:col-span-2"><label class="label" :for="`b${i}`">تاريخ الميلاد</label><input :id="`b${i}`" v-model="r.birthDate" type="date" :max="today" class="input num" /></div>
          <div class="sm:col-span-2"><label class="label" :for="`p${i}`">رقم الجواز</label><input :id="`p${i}`" v-model="r.passportNo" class="input num uppercase" dir="ltr" autocomplete="off" /></div>
          <div class="sm:col-span-2"><label class="label" :for="`e${i}`">تاريخ انتهاء الجواز</label><input :id="`e${i}`" v-model="r.passportExpiry" type="date" :min="today" class="input num" /></div>
          <div class="sm:col-span-2"><label class="label" :for="`c${i}`">الجنسية</label><input :id="`c${i}`" v-model="r.nationality" class="input" /></div>
        </div>
        <div class="mt-4">
          <label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-brand-300 px-4 py-2.5 text-[14px] font-bold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50" :class="uploading === i ? 'pointer-events-none opacity-60' : ''">
            <span :class="uploading === i ? 'i-lucide-loader-circle animate-spin' : 'i-lucide-camera'" class="text-lg" />{{ uploading === i ? 'جاري الرفع…' : docsOf(i).length ? 'رفع صورة جواز أخرى' : 'رفع صورة صفحة الجواز' }}
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" class="sr-only" @change="pick(i, $event)" />
          </label>
        </div>
      </div>
      <p v-if="msg" class="rounded-xl p-3.5 text-[14.5px] font-semibold" :class="msg.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'" role="status">{{ msg.t }}</p>
      <div class="flex flex-wrap items-center justify-between gap-3"><p class="flex items-start gap-2 text-[12.5px] leading-6 text-brand-500"><span class="i-lucide-lock mt-0.5 shrink-0 text-base text-emerald-600" />بياناتك وصور الجوازات تُحفظ بشكل خاص ولا يراها إلا فريق الشركة المختص بإجراءات سفرك. <NuxtLink to="/privacy" class="font-bold underline">سياسة الخصوصية</NuxtLink></p>
        <button class="btn-dark" :disabled="saving"><span v-if="saving" class="i-lucide-loader-circle animate-spin text-lg" /><template v-else>حفظ بيانات المسافرين<span class="i-lucide-save" /></template></button></div>
    </form>
  </section>
</template>
