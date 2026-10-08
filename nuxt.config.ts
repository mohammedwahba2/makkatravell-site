const prod = process.env.NODE_ENV === 'production'
const swr = (n: number) => (prod ? { swr: n } : {})

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  modules: ['@unocss/nuxt', '@nuxt/fonts', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  css: ['~/assets/css/main.css'],

  site: { url: 'https://makkatravell.com', name: 'مكة للسياحة', defaultLocale: 'ar' },

  runtimeConfig: {
    public: {
      apiBase: 'https://api.makkatravell.com/api',
      siteUrl: 'https://makkatravell.com',
      gaId: '',
      googleVerification: '',
      bingVerification: '',
    },
  },

  fonts: {
    families: [
      { name: 'Cairo', provider: 'google', weights: [400, 500, 600, 700, 800], styles: ['normal'], subsets: ['arabic', 'latin'] },
      { name: 'Reem Kufi', provider: 'google', weights: [500, 600, 700], styles: ['normal'], subsets: ['arabic', 'latin'] },
      { name: 'Space Grotesk', provider: 'google', weights: [500, 600, 700], styles: ['normal'], subsets: ['latin'] },
    ],
  },

  routeRules: {
    '/': swr(120),
    '/umrah': swr(120),
    '/hajj': swr(120),
    '/packages': swr(120),
    '/packages/**': swr(120),
    '/blog': swr(300),
    '/blog/**': swr(300),
    '/faq': swr(300),
    '/contact': swr(600),
    '/about': swr(3600),
    '/services': swr(3600),
    '/privacy': swr(86400),
    '/terms': swr(86400),
    '/book/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/track': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/book/**', '/track'],
    defaults: { changefreq: 'weekly', priority: 0.7 },
  },
  robots: { disallow: ['/book', '/track'] },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      titleTemplate: '%s | مكة للسياحة',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#3B2418' },
        { name: 'format-detection', content: 'telephone=yes' },
        { property: 'og:site_name', content: 'مكة للسياحة' },
        { property: 'og:locale', content: 'ar_EG' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  nitro: { compressPublicAssets: true },
  experimental: { defaults: { nuxtLink: { prefetchOn: { visibility: false, interaction: true } } } },
})
