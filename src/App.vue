<script setup lang="ts">
import { useSeoMeta, useHead } from '@unhead/vue'
import { defaultMetadata } from './router'
import { PARENT_SITE_NAME, SITE_URL } from './constants/project'
import type { WithContext, WebSite } from 'schema-dts'

const { title, description, visibleToSearchEngines } = defaultMetadata

useSeoMeta({
  title,
  description,

  ogTitle: title,
  ogDescription: description,
  ogSiteName: PARENT_SITE_NAME,
  ogUrl: SITE_URL,
  ogImage: `${SITE_URL}apple-icon.png`,

  robots: visibleToSearchEngines ? 'all' : 'none',
})

const jsonLd: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: PARENT_SITE_NAME,
  url: SITE_URL,
}

useHead({
  link: [
    {
      rel: 'canonical',
      href: SITE_URL,
    },
    {
      rel: 'icon',
      href: `${import.meta.env.BASE_URL}favicon.ico`,
      type: 'image/x-icon',
      sizes: 'any',
    },
    {
      rel: 'icon',
      href: `${import.meta.env.BASE_URL}icon.svg`,
      type: 'image/svg+xml',
    },
    {
      rel: 'apple-touch-icon',
      href: `${import.meta.env.BASE_URL}apple-icon.png`,
      type: 'image/png',
      sizes: '180x180',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd),
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
