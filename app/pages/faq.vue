<script setup lang="ts">
const api = useApi()
const { data: faqs } = await useAsyncData('faqs-all', () => api<any[]>('/faqs').catch(() => [] as any[]), { default: () => [] as any[] })
usePageSeo(() => ({ title: 'الأسئلة الشائعة عن العمرة والحج والحجز', description: 'إجابات عن أكثر الأسئلة شيوعًا حول الحجز والمستندات والدفع والإلغاء وبرامج العمرة والحج مع مكة للسياحة.', breadcrumbs: [{ name: 'الأسئلة الشائعة', path: '/faq' }], jsonLd: faqs.value.length ? [faqSchema(faqs.value)] : [] }))
</script>
<template>
  <div>
    <PageHero eyebrow="الأسئلة الشائعة" title="كل ما تريد معرفته قبل الحجز" :crumbs="[{ name: 'الأسئلة الشائعة' }]" />
    <section class="wrap max-w-[860px] py-16 sm:py-24"><div v-if="faqs.length" class="rv"><FaqList :items="faqs" /></div><p v-else class="rounded-3xl bg-white p-12 text-center text-brand-700">سنضيف الأسئلة الشائعة قريبًا. يمكنك التواصل معنا مباشرة لأي استفسار.</p>
      <div class="rv mt-12 rounded-[24px] bg-brand-100 p-8 text-center"><h2 class="font-display text-[26px]">لم تجد إجابة سؤالك؟</h2><p class="mt-2 text-brand-700">فريقنا جاهز للرد عليك.</p><NuxtLink to="/contact" class="btn-dark mt-5">تواصل معنا</NuxtLink></div></section>
  </div>
</template>
