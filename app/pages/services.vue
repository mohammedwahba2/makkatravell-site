<script setup lang="ts">
usePageSeo({ title: 'خدماتنا: عمرة وحج وتأشيرات وإقامة ونقل', description: 'تعرف على خدمات مكة للسياحة بدمياط: برامج العمرة والحج والسياحة الدينية، تجهيز التأشيرات والأوراق، الإقامة الفندقية، الطيران، المواصلات والإشراف الديني.', breadcrumbs: [{ name: 'خدماتنا', path: '/services' }] })
const items = [
  { i: 'i-lucide-moon-star', t: 'برامج العمرة', d: 'برامج بمدد وأسعار مختلفة طوال العام، وعمرة رمضان والمواسم، تناسب الأفراد والأسر والمجموعات.', to: '/umrah' },
  { i: 'i-lucide-landmark', t: 'برامج الحج', d: 'تنظيم رحلات الحج السياحي وفق ضوابط الجهات الرسمية، مع إشراف ديني ومتابعة كاملة في المشاعر.', to: '/hajj' },
  { i: 'i-lucide-map', t: 'السياحة الدينية', d: 'زيارات المدينة المنورة ومكة المكرمة والمعالم الإسلامية، مع مرشد يشرح تاريخ كل موقع.' },
  { i: 'i-lucide-file-check-2', t: 'التأشيرات والأوراق', d: 'نساعدك في تجهيز المستندات المطلوبة وإجراءات التأشيرة من بداية التسجيل.' },
  { i: 'i-lucide-hotel', t: 'الإقامة الفندقية', d: 'فنادق بتصنيفات مختلفة في مكة والمدينة، مع غرف ثنائية وثلاثية ورباعية.' },
  { i: 'i-lucide-plane', t: 'الطيران والمواصلات', d: 'تذاكر الطيران وانتقالات مكيفة بين المطار والفنادق والمدن، ضمن البرنامج.' },
  { i: 'i-lucide-book-open-check', t: 'الإشراف الديني', d: 'مرشد يرافق المجموعة ويوضح المناسك خطوة بخطوة ويجيب عن أسئلتكم.' },
  { i: 'i-lucide-headset', t: 'المتابعة والدعم', d: 'تواصل مستمر قبل السفر وأثناءه عبر الهاتف وواتساب لحل أي موقف بسرعة.' },
]
</script>
<template>
  <div>
    <PageHero eyebrow="ما نقدمه" title="خدمات متكاملة، من أول سؤال حتى العودة" sub="كل ما تحتاجه لرحلة ميسّرة في مكان واحد." :crumbs="[{ name: 'خدماتنا' }]" />
    <section class="wrap py-16 sm:py-24"><ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><li v-for="s in items" :key="s.t" class="rv group flex flex-col rounded-[22px] bg-white p-7 shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)] transition-all duration-500 hover:-translate-y-1.5 hover:bg-brand-900 hover:text-white"><span class="grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-700 transition-colors duration-500 group-hover:bg-brand-400 group-hover:text-brand-950"><span :class="s.i" class="text-[28px]" /></span><h3 class="mt-6 font-display text-[23px]">{{ s.t }}</h3><p class="mt-2 flex-1 text-[15px] leading-7 text-brand-700 transition-colors duration-500 group-hover:text-brand-200">{{ s.d }}</p><NuxtLink v-if="s.to" :to="s.to" class="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-brand-600 group-hover:text-brand-300">تصفح البرامج<span class="i-lucide-arrow-left" /></NuxtLink></li></ul></section>
    <CtaBand />
  </div>
</template>
