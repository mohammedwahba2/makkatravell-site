// schema.org JSON-LD builders. Only real data goes in: no fabricated ratings, reviews or hours.
type Json = Record<string, any>
const abs = (siteUrl: string, p?: string | null) => (!p ? undefined : /^https?:/.test(p) ? p : `${siteUrl}${p.startsWith('/') ? '' : '/'}${p}`)

export const orgSchema = (s: SiteSettings, siteUrl: string): Json => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'TravelAgency', 'LocalBusiness'],
  '@id': `${siteUrl}/#organization`,
  name: s.name, alternateName: 'Makka Travel', url: siteUrl, slogan: s.tagline,
  description: 'شركة مكة للسياحة بدمياط: برامج عمرة وحج وسياحة دينية بإشراف ديني وخدمة متكاملة من القاهرة وجميع المحافظات.',
  logo: { '@type': 'ImageObject', url: `${siteUrl}/logo-transparent.png`, width: 512, height: 512 },
  image: `${siteUrl}/og-default.jpg`,
  founder: { '@type': 'Person', name: 'أيمن النماس' },
  telephone: s.phone, ...(s.email ? { email: s.email } : {}),
  address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.city, addressRegion: 'دمياط', addressCountry: 'EG' },
  areaServed: { '@type': 'Country', name: 'مصر' },
  knowsLanguage: 'ar',
  ...(s.licenseNumber ? { identifier: { '@type': 'PropertyValue', name: s.licenseAuthority || 'رقم الترخيص', value: s.licenseNumber } } : {}),
  sameAs: Object.values(s.social || {}).filter(Boolean),
  contactPoint: [{ '@type': 'ContactPoint', telephone: s.phone, contactType: 'customer service', areaServed: 'EG', availableLanguage: 'Arabic' }],
})

export const websiteSchema = (s: SiteSettings, siteUrl: string): Json => ({
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: s.name, inLanguage: 'ar',
  publisher: { '@id': `${siteUrl}/#organization` },
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/packages?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
})

export const breadcrumbSchema = (items: { name: string; path: string }[], siteUrl: string): Json => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${siteUrl}${it.path}` })),
})

export const faqSchema = (faqs: { question: string; answer: string }[]): Json => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
})

export const packageSchema = (p: any, siteUrl: string): Json => {
  const deps: any[] = p.departures ?? []
  const prices = [Number(p.basePrice), ...deps.flatMap((d) => [d.priceDouble, d.priceTriple, d.priceQuad]).filter(Boolean).map(Number)]
  const open = deps.some((d) => d.isOpen && d.seatsTaken < d.seatsTotal)
  const url = `${siteUrl}/packages/${p.slug}`
  const images = [abs(siteUrl, p.coverImage), ...(p.gallery ?? []).map((g: string) => abs(siteUrl, g))].filter(Boolean)
  return {
    '@context': 'https://schema.org', '@type': ['Product', 'TouristTrip'], '@id': `${url}#trip`,
    name: p.title, description: p.summary, sku: p.slug, url,
    image: images.length ? images : [`${siteUrl}/og-default.jpg`],
    category: PACKAGE_TYPES[p.type] ?? 'رحلة',
    brand: { '@type': 'Brand', name: 'مكة للسياحة' },
    provider: { '@id': `${siteUrl}/#organization` },
    touristType: p.type === 'HAJJ' ? 'حجاج' : p.type === 'UMRAH' ? 'معتمرون' : 'سائحون',
    ...(p.itinerary?.length ? { itinerary: { '@type': 'ItemList', itemListElement: p.itinerary.map((d: any, i: number) => ({ '@type': 'ListItem', position: i + 1, name: d.title, description: d.text })) } } : {}),
    offers: {
      '@type': 'AggregateOffer', priceCurrency: p.currency || 'EGP', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: Math.max(1, deps.length),
      availability: deps.length ? (open ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut') : 'https://schema.org/PreOrder',
      url, seller: { '@id': `${siteUrl}/#organization` },
    },
  }
}

export const articleSchema = (a: any, siteUrl: string): Json => ({
  '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, inLanguage: 'ar',
  image: [abs(siteUrl, a.coverImage) ?? `${siteUrl}/og-default.jpg`],
  datePublished: a.publishedAt, dateModified: a.updatedAt || a.publishedAt,
  mainEntityOfPage: `${siteUrl}/blog/${a.slug}`,
  author: { '@id': `${siteUrl}/#organization` }, publisher: { '@id': `${siteUrl}/#organization` },
})

export const itemListSchema = (items: { name: string; path: string }[], siteUrl: string): Json => ({
  '@context': 'https://schema.org', '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: `${siteUrl}${it.path}` })),
})
