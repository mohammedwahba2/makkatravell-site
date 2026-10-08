// Feeds @nuxtjs/sitemap with dynamic URLs from the public API (packages + blog posts).
export default defineSitemapEventHandler(async () => {
  const base = useRuntimeConfig().public.apiBase as string
  try {
    const data = await $fetch<{ packages: { slug: string; updatedAt: string }[]; posts: { slug: string; updatedAt: string }[] }>(`${base}/sitemap-data`)
    return [
      ...data.packages.map((p) => ({ loc: `/packages/${p.slug}`, lastmod: p.updatedAt, changefreq: 'weekly' as const })),
      ...data.posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updatedAt, changefreq: 'monthly' as const })),
    ]
  } catch { return [] }
})
