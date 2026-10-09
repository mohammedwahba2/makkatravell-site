<script setup lang="ts">
// Loads GA4 / Meta Pixel / TikTok Pixel from the IDs saved in the admin (Settings -> Tracking), after the page is idle.
// IDs are validated before being placed in a script URL.
const { site } = useSite()
const cfg = useRuntimeConfig().public
const router = useRouter()
const loaded = new Set<string>()
const script = (src: string) => new Promise<void>((res) => { const s = document.createElement('script'); s.async = true; s.src = src; s.onload = () => res(); s.onerror = () => res(); document.head.appendChild(s) })

async function boot() {
  const t = site.value.tracking ?? {}
  const w = window as any
  const ga = (t.gaId || (cfg.gaId as string) || '').trim()
  if (/^G-[A-Z0-9]{4,20}$/.test(ga) && !loaded.has('ga')) {
    loaded.add('ga'); w.dataLayer = w.dataLayer || []; w.gtag = function () { w.dataLayer.push(arguments) }
    await script(`https://www.googletagmanager.com/gtag/js?id=${ga}`); w.gtag('js', new Date()); w.gtag('config', ga, { anonymize_ip: true })
  }
  const fb = (t.metaPixelId || '').trim()
  if (/^\d{8,20}$/.test(fb) && !loaded.has('fb')) {
    loaded.add('fb')
    if (!w.fbq) { const n: any = (w.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }); n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [] }
    await script('https://connect.facebook.net/en_US/fbevents.js'); w.fbq('init', fb); w.fbq('track', 'PageView')
  }
  const tk = (t.tiktokPixelId || '').trim()
  if (/^[A-Z0-9]{10,30}$/.test(tk) && !loaded.has('tt')) {
    loaded.add('tt')
    const q: any = (w.ttq = w.ttq || []); q._i = q._i || {}; q.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie']
    q.setAndDefer = (o: any, m: string) => { o[m] = function () { o.push([m].concat(Array.prototype.slice.call(arguments, 0))) } }
    for (const m of q.methods) q.setAndDefer(q, m)
    q._i[tk] = []; q._t = q._t || {}; q._t[tk] = +new Date(); q._o = q._o || {}
    await script(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${tk}&lib=ttq`); w.ttq.page()
  }
}

onMounted(() => {
  const run = () => boot()
  ;('requestIdleCallback' in window) ? (window as any).requestIdleCallback(run, { timeout: 4000 }) : setTimeout(run, 2500)
  // SPA navigations: report page views to the loaded tools
  let first = true
  router.afterEach((to) => {
    if (first) { first = false; return }
    const w = window as any
    try { w.gtag?.('event', 'page_view', { page_path: to.fullPath }) } catch { /* ignore */ }
    try { w.fbq?.('track', 'PageView') } catch { /* ignore */ }
    try { w.ttq?.page() } catch { /* ignore */ }
  })
  // one delegated listener covers every WhatsApp / phone link on the site
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null
    if (!a) return
    const href = a.getAttribute('href') || ''
    if (href.startsWith('https://wa.me')) track('contact_whatsapp', { method: 'whatsapp', page: location.pathname })
    else if (href.startsWith('tel:')) track('contact_call', { method: 'phone', page: location.pathname })
  }, { passive: true })
})
</script>
<template><span hidden /></template>
