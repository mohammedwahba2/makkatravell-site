<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
const is404 = computed(() => props.error.statusCode === 404)
useHead({ title: is404.value ? 'الصفحة غير موجودة' : 'حدث خطأ', meta: [{ name: 'robots', content: 'noindex' }] })
</script>
<template>
  <div class="grid min-h-dvh place-items-center bg-brand-950 px-6 text-center star-pattern">
    <div class="max-w-lg">
      <p class="num font-display text-[120px] leading-none text-brand-400/90">{{ error.statusCode }}</p>
      <h1 class="mt-4 font-display text-4xl text-white">{{ is404 ? 'ضللت الطريق؟' : 'حدث خطأ غير متوقع' }}</h1>
      <p class="mt-4 leading-8 text-brand-200">{{ is404 ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للرئيسية أو تصفح برامج العمرة.' : 'نعمل على إصلاحه، حاول مرة أخرى بعد قليل.' }}</p>
      <div class="mt-9 flex flex-wrap justify-center gap-3"><button class="btn-copper" @click="clearError({ redirect: '/' })">العودة للرئيسية</button><NuxtLink to="/umrah" class="btn-line-light" @click="clearError()">برامج العمرة</NuxtLink></div>
    </div>
  </div>
</template>
