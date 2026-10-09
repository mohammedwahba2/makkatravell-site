<script setup lang="ts">
const faqs = [
  { question: 'ما هي أركان الحج؟', answer: 'أركان الحج: الإحرام (النية)، والوقوف بعرفة، وطواف الإفاضة، والسعي بين الصفا والمروة. ومن أيام الحج المعروفة: يوم التروية، ثم يوم عرفة، ثم المبيت بمزدلفة، ثم أيام منى ورمي الجمرات.' },
  { question: 'متى يكون موسم الحج؟', answer: 'يكون الحج في شهر ذي الحجة من كل عام هجري، ويتغير موعده الميلادي من عام لآخر. نعلن برامجنا ومواعيدها فور اعتمادها.' },
  { question: 'كيف يتم الحجز للحج؟', answer: 'يخضع الحج السياحي لضوابط وتصاريح الجهات الرسمية، وتختلف شروطه من عام لآخر. تواصل معنا لمعرفة المتاح حاليًا وخطوات التسجيل والأوراق المطلوبة.' },
]
usePageSeo(() => ({
  title: 'برامج الحج السياحي من مصر | مكة للسياحة',
  description: 'استفسر عن برامج الحج مع مكة للسياحة بدمياط: إشراف ديني، إقامة منظمة، ومتابعة كاملة طوال الرحلة. تعرف على أركان الحج وخطوات التسجيل.',
  breadcrumbs: [{ name: 'الحج', path: '/hajj' }], jsonLd: [faqSchema(faqs)],
}))
const days = [
  { d: 'يوم التروية', t: 'الإحرام بالحج والتوجه إلى منى.' }, { d: 'يوم عرفة', t: 'الوقوف بعرفة، وهو أعظم أركان الحج.' },
  { d: 'مزدلفة', t: 'المبيت بمزدلفة وجمع الحصى.' }, { d: 'أيام منى', t: 'رمي الجمرات والنحر والحلق، وطواف الإفاضة والسعي.' },
]
</script>
<template>
  <div>
    <PageHero eyebrow="برامج الحج" title="الحج رحلة العمر، نرتبها لك بإتقان" sub="إشراف ديني متخصص وتنظيم دقيق للإقامة والتنقل في المشاعر المقدسة." :crumbs="[{ name: 'الحج' }]">
      <NuxtLink to="#programs" class="btn-copper" data-magnetic>برامج الحج المتاحة<span class="i-lucide-arrow-down" /></NuxtLink>
    </PageHero>
    <section id="programs" class="wrap scroll-mt-28 py-16 sm:py-24"><SectionHead eyebrow="البرامج المتاحة" title="برامج الحج" sub="يتم الإعلان عن برامج الحج فور اعتمادها من الجهات المختصة." /><div class="mt-12"><PackagesByType type="HAJJ" empty="لم يتم الإعلان عن برامج الحج لهذا الموسم بعد. تواصل معنا ليصلك الإعلان فور اعتماد البرامج." /></div></section>
    <section class="wrap pb-16 sm:pb-24">
      <SectionHead center eyebrow="دليل سريع" title="محطات الحج الرئيسية" />
      <ol class="mt-12 grid gap-5 md:grid-cols-4"><li v-for="(x, i) in days" :key="x.d" class="rv rounded-[22px] bg-white p-6 shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)]"><span class="num text-5xl font-bold text-brand-200">0{{ i + 1 }}</span><h3 class="mt-2 font-display text-[22px]">{{ x.d }}</h3><p class="mt-2 text-[15px] leading-7 text-brand-700">{{ x.t }}</p></li></ol>
    </section>
    <section class="wrap pb-24"><div class="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><SectionHead eyebrow="أسئلة شائعة" title="قبل أن تحجز حجّك" /><div class="rv"><FaqList :items="faqs" /></div></div></section>
    <CtaBand />
  </div>
</template>
