export interface SiteSettings {
  name: string; tagline: string; city: string; country: string; phone: string; whatsapp: string; email: string; address: string
  workingHours: string; social: { facebook?: string; instagram?: string; tiktok?: string; youtube?: string }
  licenseNumber?: string; licenseAuthority?: string; responseTime?: string; paymentNote?: string
  paymentMethods?: { label: string; details: string }[]
  tracking?: { gaId?: string; metaPixelId?: string; tiktokPixelId?: string }
}
// Real contact data of the office. Overridden by the admin "Site settings" screen (API) when present.
const DEFAULTS: SiteSettings = {
  name: 'مكة للسياحة', tagline: 'ركز في عمرتك واترك لنا شرف خدمتك', city: 'دمياط', country: 'مصر',
  phone: '+201555411248', whatsapp: '201555411248', email: '',
  address: 'دمياط، طريق المحور، تقسيم المعلمين، أعلى معارض النماس للموبيليات، الدور الأول', workingHours: '',
  social: {
    facebook: 'https://www.facebook.com/share/1M39iYKJgu/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/makkah.travel.by.ayman.elnmas',
    tiktok: 'https://www.tiktok.com/@makkah.by.ayman.elnmas',
  },
}

export const useSite = () => {
  const api = useApi()
  const { data } = useAsyncData('site-settings', async () => {
    try { return (await api<{ site?: Partial<SiteSettings> }>('/settings')).site ?? {} } catch { return {} }
  }, { default: () => ({}) })
  const site = computed<SiteSettings>(() => {
    const s = (data.value ?? {}) as Partial<SiteSettings>
    return { ...DEFAULTS, ...Object.fromEntries(Object.entries(s).filter(([, v]) => v !== '' && v != null)), social: { ...DEFAULTS.social, ...(s.social ?? {}) } } as SiteSettings
  })
  const phoneDisplay = computed(() => site.value.phone.replace(/^\+20/, '0').replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3'))
  const tel = computed(() => `tel:${site.value.phone}`)
  const wa = (text = 'السلام عليكم، أريد الاستفسار عن برامج العمرة') => `https://wa.me/${site.value.whatsapp}?text=${encodeURIComponent(text)}`
  const siteUrl = (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')
  return { site, phoneDisplay, tel, wa, siteUrl }
}
