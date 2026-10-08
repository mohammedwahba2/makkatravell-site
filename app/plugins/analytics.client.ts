// Google Analytics 4 — loads only when NUXT_PUBLIC_GA_ID is set, and only after the page is idle.
export default defineNuxtPlugin(() => {
  const id = useRuntimeConfig().public.gaId as string
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return
  const load = () => {
    const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s)
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void }
    w.dataLayer = w.dataLayer || []; w.gtag = function () { w.dataLayer.push(arguments) }
    w.gtag('js', new Date()); w.gtag('config', id, { anonymize_ip: true })
  }
  ;('requestIdleCallback' in window) ? (window as any).requestIdleCallback(load, { timeout: 4000 }) : setTimeout(load, 2500)
})
