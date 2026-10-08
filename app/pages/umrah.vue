<script setup lang="ts">
const { siteUrl } = useSite()
const faqs = [
  { question: 'ما هي خطوات أداء العمرة؟', answer: 'تبدأ العمرة بالإحرام من الميقات مع نية العمرة والتلبية، ثم الطواف بالكعبة المشرفة سبعة أشواط، وصلاة ركعتين خلف مقام إبراهيم إن تيسر، ثم السعي بين الصفا والمروة سبعة أشواط، وتنتهي بالحلق أو التقصير.' },
  { question: 'ما المستندات المطلوبة للعمرة من مصر؟', answer: 'أهم ما يُطلب عادة: جواز سفر ساري المفعول لمدة كافية، وصور شخصية حديثة، وصورة البطاقة الشخصية. وقد تختلف الاشتراطات وتتغير من وقت لآخر، لذلك نؤكدها معك عند الحجز.' },
  { question: 'ما الفرق بين برامج العمرة المختلفة؟', answer: 'تختلف البرامج في مدة الرحلة وعدد الليالي في مكة والمدينة وتصنيف الفندق وقربه من الحرم ونوع الغرفة، وبالتالي في السعر. نعرض كل ذلك بوضوح في صفحة كل برنامج.' },
  { question: 'هل أستطيع السفر مع أسرتي؟', answer: 'نعم، يمكنك الحجز لأكثر من فرد، واختيار غرفة ثنائية أو ثلاثية أو رباعية، مع تسعير مخصص للأطفال. أدخل عدد الأفراد عند الحجز وسنؤكد التفاصيل معك.' },
]
usePageSeo(() => ({
  title: 'برامج العمرة من مصر | أسعار ومواعيد وإقامة بجوار الحرم',
  description: 'احجز عمرتك مع مكة للسياحة بدمياط: برامج عمرة بمدد 7 و10 و15 يومًا وعمرة رمضان، إقامة مختارة قريبة من الحرم، تأشيرة وطيران ومرشد ديني. اعرف الأسعار والمواعيد.',
  breadcrumbs: [{ name: 'العمرة', path: '/umrah' }], jsonLd: [faqSchema(faqs)],
}))
const rites = [
  { t: 'الإحرام والنية', d: 'من الميقات، مع نية العمرة والتلبية.' },
  { t: 'الطواف', d: 'سبعة أشواط حول الكعبة المشرفة، ثم ركعتان خلف المقام.' },
  { t: 'السعي', d: 'سبعة أشواط بين الصفا والمروة.' },
  { t: 'الحلق أو التقصير', d: 'وبه تتم العمرة والتحلل من الإحرام.' },
]
</script>
<template>
  <div>
    <PageHero eyebrow="برامج العمرة" title="عمرة بطمأنينة، من دمياط إلى بيت الله" sub="برامج متنوعة المدة والإقامة، بإشراف ديني وخدمة متكاملة من لحظة التسجيل حتى العودة." :crumbs="[{ name: 'العمرة' }]">
      <NuxtLink to="#programs" class="btn-copper" data-magnetic>تصفح البرامج<span class="i-lucide-arrow-down" /></NuxtLink>
    </PageHero>
    <section id="programs" class="wrap scroll-mt-28 py-16 sm:py-24"><SectionHead eyebrow="البرامج المتاحة" title="برامج العمرة" /><div class="mt-12"><PackagesByType type="UMRAH" empty="لا توجد برامج عمرة منشورة حاليًا. تواصل معنا لمعرفة المواعيد القادمة." /></div></section>

    <section class="wrap pb-16 sm:pb-24">
      <div class="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div><SectionHead eyebrow="دليل سريع" title="مناسك العمرة في أربع خطوات" sub="مرشدنا الديني يرافقك ويشرح لك كل خطوة أثناء الرحلة، لتؤدي عمرتك على بصيرة." /></div>
        <ol class="space-y-3"><li v-for="(r, i) in rites" :key="r.t" class="rv flex items-start gap-5 rounded-2xl bg-white p-5 shadow-[0_18px_40px_-30px_rgb(59_36_24/.3)]"><span class="num grid size-12 shrink-0 place-items-center rounded-xl bg-brand-900 text-xl font-bold text-brand-50">{{ i + 1 }}</span><div><h3 class="font-display text-[21px]">{{ r.t }}</h3><p class="mt-1 text-[15px] leading-7 text-brand-700">{{ r.d }}</p></div></li></ol>
      </div>
    </section>

    <section class="wrap pb-24"><div class="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><SectionHead eyebrow="أسئلة شائعة" title="قبل أن تحجز عمرتك" /><div class="rv"><FaqList :items="faqs" /></div></div></section>
    <CtaBand />
  </div>
</template>
