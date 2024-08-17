<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { defaultMetadata } from './router'

useHead(() => {
  const { title, description, visibleToSearchEngines } = defaultMetadata

  return {
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'robots',
        content: visibleToSearchEngines ? 'all' : 'none',
      },
    ],
  }
})
</script>

<template>
  <RouterView />
</template>
