<script setup lang="ts">
const route = useRoute()
const api = useApi()
const { siteUrl } = useSite()
const slug = String(route.params.slug)
const { data: post } = await useAsyncData(`post-${slug}`, () => api<any>(`/posts/${encodeURIComponent(slug)}`).catch(() => null))
if (!post.value) throw createError({ statusCode: 404, statusMessage: 'المقال غير موجود', fatal: true })
const { data: more } = await useAsyncData(`more-${slug}`, async () => (await api<{ items: any[] }>('/posts', { query: { limit: 4 } }).catch(() => ({ items: [] as any[] }))).items.filter((p: any) => p.slug !== slug).slice(0, 3), { default: () => [] as any[] })
const html = computed(() => richText(post.value.content))
usePageSeo(() => ({
  title: post.value.seoTitle || post.value.title, description: post.value.seoDescription || post.value.excerpt, image: post.value.coverImage, type: 'article',
  published: post.value.publishedAt, modified: post.value.updatedAt,
  breadcrumbs: [{ name: 'المدونة', path: '/blog' }, { name: post.value.title, path: `/blog/${slug}` }], jsonLd: [articleSchema(post.value, siteUrl)],
}))
</script>
<template>
  <article v-if="post">
    <PageHero :eyebrow="post.category" :title="post.title" :crumbs="[{ name: 'المدونة', to: '/blog' }, { name: post.title }]"><p class="text-[14px] text-brand-300">{{ fdate(post.publishedAt) }} · قراءة <span class="num">{{ readMinutes(post.content) }}</span> دقائق</p></PageHero>
    <div class="wrap max-w-[800px] py-14 sm:py-20">
      <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" width="1200" height="750" class="rv mb-12 aspect-[16/10] w-full rounded-[26px] object-cover shadow-[0_30px_70px_-40px_rgb(59_36_24/.5)]" fetchpriority="high" />
      <p class="rv mb-10 border-s-4 border-brand-400 ps-5 text-[20px] font-semibold leading-9 text-brand-800">{{ post.excerpt }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="prose-ar" v-html="html" />
      <div class="mt-14 rounded-[24px] bg-brand-900 p-8 text-center text-white"><h2 class="font-display text-[26px]">تخطط لعمرتك القادمة؟</h2><p class="mt-2 text-brand-200">تصفح برامجنا أو تواصل معنا لنساعدك في الاختيار.</p><div class="mt-6 flex flex-wrap justify-center gap-3"><NuxtLink to="/umrah" class="btn-copper">برامج العمرة</NuxtLink><NuxtLink to="/contact" class="btn-line-light">تواصل معنا</NuxtLink></div></div>
    </div>
    <section v-if="more.length" class="wrap pb-20"><SectionHead eyebrow="اقرأ أيضًا" title="مقالات أخرى" /><div class="mt-10 grid gap-6 md:grid-cols-3"><div v-for="m in more" :key="m.id" class="rv"><PostCard :post="m" /></div></div></section>
  </article>
</template>
<style>
.prose-ar { font-size: 18px; line-height: 2.05; color: #3B2418; }
.prose-ar h2 { font-family: 'Reem Kufi', 'Cairo', sans-serif; font-size: 32px; line-height: 1.35; margin: 2.2em 0 .6em; color: #241811; }
.prose-ar h3 { font-family: 'Reem Kufi', 'Cairo', sans-serif; font-size: 25px; margin: 1.8em 0 .5em; color: #241811; }
.prose-ar p { margin: 0 0 1.2em; }
.prose-ar ul { margin: 0 0 1.4em; padding: 0; list-style: none; }
.prose-ar li { position: relative; padding-inline-start: 1.7em; margin-bottom: .5em; }
.prose-ar li::before { content: ''; position: absolute; inset-inline-start: .2em; top: .85em; width: .55em; height: .55em; border-radius: 50%; background: #C98F68; }
.prose-ar a { color: #85573B; text-decoration: underline; text-underline-offset: 4px; }
.prose-ar strong { color: #241811; }
</style>
