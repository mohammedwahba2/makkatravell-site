/**
 * Motion layer: smooth scrolling (Lenis) + scroll reveals / parallax / magnetic buttons (GSAP).
 * Loaded AFTER the app is mounted (dynamic imports) so ~80 KB of animation code never blocks first paint.
 * Content is fully visible without JS; the `.js` class on <html> is what enables the hidden "before reveal" state.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // never leave content hidden if animation code fails or is slow
  const fallback = setTimeout(() => document.documentElement.classList.add('rv-fallback'), 5000)

  nuxtApp.hook('app:mounted', async () => {
    if (reduce) { clearTimeout(fallback); document.documentElement.classList.add('rv-fallback'); return }
    const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')])
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)

    const setup = () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      for (const sel of ['.rv', '.rv-x', '.rv-s']) {
        ScrollTrigger.batch(`${sel}:not(.rv-done)`, {
          start: 'top 92%', once: true, interval: 0.08, batchMax: 6,
          onEnter: (els) => {
            gsap.to(els, {
              opacity: 1, x: 0, y: 0, scale: 1, duration: 1.05, ease: 'power3.out', stagger: 0.09, overwrite: true,
              // mark as finished BEFORE the inline styles are cleared, so the CSS "final state" rule (.rv-done) takes over
              // with no jump. (Clearing the transform while only the hidden-state rule existed made elements drop 34px.)
              onComplete: () => els.forEach((e) => { e.classList.add('rv-done'); (e as HTMLElement).style.removeProperty('transform'); (e as HTMLElement).style.removeProperty('opacity') }),
            })
          },
        })
      }
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const k = parseFloat(el.dataset.parallax || '0.2')
        gsap.to(el, { yPercent: -100 * k, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
      })
      if (window.matchMedia('(pointer: fine)').matches) {
        gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
          if (el.dataset.magneticReady) return
          el.dataset.magneticReady = '1'
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
          el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.22); yTo((e.clientY - r.top - r.height / 2) * 0.3) })
          el.addEventListener('pointerleave', () => { xTo(0); yTo(0) })
        })
      }
      ScrollTrigger.refresh()
    }

    setup() // first page
    console.info('[motion] triggers:', ScrollTrigger.getAll().length, 'rv:', document.querySelectorAll('.rv:not(.rv-done)').length)
    clearTimeout(fallback)
    nuxtApp.hook('page:finish', () => { lenis.scrollTo(0, { immediate: true }); requestAnimationFrame(() => requestAnimationFrame(setup)) })
  })
})
