import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/**
 * Global motion layer: smooth scrolling (Lenis) + scroll reveals (GSAP ScrollTrigger) + parallax.
 * Content is fully visible without JS; `.js` on <html> is what enables the hidden initial state.
 */
export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null

  if (!reduce) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis!.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  const setup = () => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
    if (reduce) return
    // reveals
    const groups = ['.rv', '.rv-x', '.rv-s'] as const
    for (const sel of groups) {
      ScrollTrigger.batch(sel, {
        start: 'top 92%', once: true, interval: 0.08, batchMax: 6,
        onEnter: (els) => gsap.to(els, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.05, ease: 'power3.out', stagger: 0.09, overwrite: true, clearProps: 'transform' }),
      })
    }
    // parallax: <el data-parallax="0.25">
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const k = parseFloat(el.dataset.parallax || '0.2')
      gsap.to(el, { yPercent: -100 * k, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
    })
    // magnetic buttons (fine pointers only)
    if (window.matchMedia('(pointer: fine)').matches) {
      gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
        el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.22); yTo((e.clientY - r.top - r.height / 2) * 0.3) })
        el.addEventListener('pointerleave', () => { xTo(0); yTo(0) })
      })
    }
    ScrollTrigger.refresh()
  }

  nuxtApp.hook('page:finish', () => { lenis?.scrollTo(0, { immediate: true }); requestAnimationFrame(() => requestAnimationFrame(setup)) })
  nuxtApp.hook('page:transition:finish', () => { requestAnimationFrame(setup) })
  // safety net: if something stalls, never leave content hidden
  setTimeout(() => document.documentElement.classList.add('rv-fallback'), 6000)

  return { provide: { gsap, lenis: () => lenis, ScrollTrigger } }
})
