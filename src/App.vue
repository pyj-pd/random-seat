<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { getRouteMetadata } from './utils/route'
import type { RouteName } from './router'

const route = useRoute(),
  { title, description } = getRouteMetadata(route.name as RouteName)

useHead({
  title,
  meta: [
    {
      name: 'description',
      content: description,
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
