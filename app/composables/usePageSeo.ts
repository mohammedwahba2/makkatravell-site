export interface SeoInput {
  title: string; rawTitle?: boolean; description: string; image?: string | null; type?: 'website' | 'article'; noindex?: boolean
  jsonLd?: Record<string, any>[]; breadcrumbs?: { name: string; path: string }[]; published?: string; modified?: string
}

/** One call per page: <title>, description, canonical, Open Graph, Twitter, robots and JSON-LD. */
export const usePageSeo = (input: SeoInput | (() => SeoInput)) => {
  const route = useRoute()
  const cfg = useRuntimeConfig().public
  const siteUrl = (cfg.siteUrl as string).replace(/\/$/, '')
  const { site } = useSite()
  const get = () => (typeof input === 'function' ? input() : input)
  const BRAND = 'مكة للسياحة'
  const hasBrand = (t: string) => t.includes(BRAND)

  const abs = (p?: string | null) => (!p ? `${siteUrl}/og-default.jpg` : /^https?:/.test(p) ? p : `${siteUrl}${p}`)
  const canonical = computed(() => `${siteUrl}${route.path === '/' ? '' : route.path.replace(/\/$/, '')}` || siteUrl)

  useSeoMeta({
    title: () => get().title,
    description: () => get().description,
    ogTitle: () => (hasBrand(get().title) ? get().title : `${get().title} | ${BRAND}`),
    ogDescription: () => get().description,
    ogType: () => get().type ?? 'website',
    ogUrl: () => canonical.value,
    ogImage: () => abs(get().image),
    ogImageAlt: () => get().title,
    ogImageWidth: () => (get().image ? undefined : 1200),
    ogImageHeight: () => (get().image ? undefined : 630),
    twitterCard: 'summary_large_image',
    twitterTitle: () => get().title,
    twitterDescription: () => get().description,
    twitterImage: () => abs(get().image),
    robots: () => (get().noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'),
    articlePublishedTime: () => get().published,
    articleModifiedTime: () => get().modified,
    googleSiteVerification: (cfg.googleVerification as string) || undefined,
  })

  useHead(() => {
    const g = get()
    const ld: Record<string, any>[] = [...(g.jsonLd ?? [])]
    if (g.breadcrumbs?.length) ld.push(breadcrumbSchema([{ name: 'الرئيسية', path: '/' }, ...g.breadcrumbs], siteUrl))
    return {
      ...(g.rawTitle || hasBrand(g.title) ? { titleTemplate: null } : {}),
      meta: cfg.bingVerification ? [{ name: 'msvalidate.01', content: cfg.bingVerification as string }] : [],
      link: [{ rel: 'canonical', href: canonical.value }],
      script: ld.map((o) => ({ type: 'application/ld+json', innerHTML: JSON.stringify(o) })),
    }
  })
  return { site, siteUrl }
}
