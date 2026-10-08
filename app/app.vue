<script setup lang="ts">
// `js` class enables the hidden initial state for reveal animations (content stays visible without JS / for crawlers).
useHead({ script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPriority: 'critical' }] })
const { site, siteUrl } = useSite()
useHead(() => ({ script: [
  { type: 'application/ld+json', innerHTML: JSON.stringify(orgSchema(site.value, siteUrl)) },
  { type: 'application/ld+json', innerHTML: JSON.stringify(websiteSchema(site.value, siteUrl)) },
] }))
</script>
<template>
  <a href="#main" class="skip-link">تخطَّ إلى المحتوى</a>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
