<script setup lang="ts">
const { site } = useSite()
usePageSeo({ title: 'من نحن | مكة للسياحة', description: 'مكة للسياحة شركة سياحة بدمياط متخصصة في برامج العمرة والحج والسياحة الدينية. تعرف على رؤيتنا وقيمنا وكيف نخدم ضيوف الرحمن.', breadcrumbs: [{ name: 'من نحن', path: '/about' }] })
const values = [
  { i: 'i-lucide-handshake', t: 'الأمانة', d: 'نلتزم بما نعد به: ما يشمله البرنامج مكتوب بوضوح، وما نتفق عليه نفي به.' },
  { i: 'i-lucide-heart-handshake', t: 'الخدمة بإحسان', d: 'نتعامل مع كل معتمر كضيف، ونحرص على راحته وراحة أسرته في كل خطوة.' },
  { i: 'i-lucide-compass', t: 'الوضوح', d: 'أسعار وتفاصيل ومواعيد واضحة قبل الحجز، دون رسوم خفية أو مفاجآت.' },
  { i: 'i-lucide-book-open-check', t: 'العلم والإرشاد', d: 'مرشدون يشرحون المناسك ويرافقون المجموعة ليؤدي الجميع عبادتهم باطمئنان.' },
]
</script>
<template>
  <div>
    <PageHero eyebrow="من نحن" title="نخدم ضيوف الرحمن من قلب" sub="مكة للسياحة شركة سياحة متخصصة في العمرة والحج والسياحة الدينية." :crumbs="[{ name: 'من نحن' }]" />
    <section class="wrap py-16 sm:py-24">
      <div class="grid items-center gap-14 lg:grid-cols-2">
        <div class="rv relative mx-auto aspect-[480/620] w-full max-w-[400px] drop-shadow-[0_30px_60px_rgba(59,36,24,.35)]"><HeroScene /></div>
        <div>
          <SectionHead eyebrow="قصتنا" title="شغفنا أن تكون رحلتك أيسر ما تكون" />
          <div class="rv mt-6 space-y-5 text-[17px] leading-9 text-brand-800">
            <p>تأسست مكة للسياحة بدمياط بإدارة <b>أيمن النماس</b> لهدف واحد: أن يتفرغ المعتمر والحاج لعبادته، ونتولى نحن عنه تفاصيل السفر من حجز وتأشيرة وإقامة وتنقل.</p>
            <p>نقدم برامج متنوعة تناسب مختلف الميزانيات والأعمار، وأسرتنا في المكتب جاهزة للرد على استفساراتك وزيارتك في أي وقت، فنحن لسنا موقعًا فقط، بل مكتب حقيقي يمكنك الوصول إليه.</p>
            <p>شعارنا الذي نعمل به كل يوم: <b>«{{ site.tagline }}»</b>.</p>
          </div>
          <div class="rv mt-8 flex flex-wrap gap-3"><NuxtLink to="/packages" class="btn-dark">تصفح البرامج</NuxtLink><NuxtLink to="/contact" class="btn-line">زرنا في المكتب</NuxtLink></div>
        </div>
      </div>
    </section>
    <section class="wrap pb-24"><SectionHead center eyebrow="قيمنا" title="ما نلتزم به معك" /><ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><li v-for="v in values" :key="v.t" class="rv rounded-[22px] bg-white p-7 text-center shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)]"><span class="mx-auto grid size-14 place-items-center rounded-full bg-brand-900 text-brand-50"><span :class="v.i" class="text-[26px]" /></span><h3 class="mt-5 font-display text-[23px]">{{ v.t }}</h3><p class="mt-2 text-[15px] leading-7 text-brand-700">{{ v.d }}</p></li></ul></section>
    <CtaBand />
  </div>
</template>
