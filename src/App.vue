<script setup lang="ts">
import { useSeoMeta, useHead } from '@unhead/vue'
import { defaultMetadata } from './router'
import { SITE_NAME, SITE_URL } from './constants/project'

const { title, description, visibleToSearchEngines } = defaultMetadata

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogSiteName: SITE_NAME,
  ogUrl: SITE_URL,
  robots: visibleToSearchEngines ? 'all' : 'none',
  ogImage: `${SITE_URL}/apple-icon.png`,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: SITE_URL,
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
