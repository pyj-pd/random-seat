<script setup lang="ts">
// @todo fix meta tags not working
// import { useHead } from '@unhead/vue'
// import { useRoute } from 'vue-router'
// import { getRouteMetadata } from './utils/route'
// import type { RouteName } from './router'

// const route = useRoute()

// useHead(() => {
//   const { title, description, visibleToSearchEngines } = getRouteMetadata(route.name as RouteName)

//   return {
//     title,
//     meta: [
//       {
//         name: 'description',
//         content: description,
//       },
//       {
//         name: 'robots',
//         content: visibleToSearchEngines ? 'all' : 'none',
//       },
//     ],
//   }
// })
</script>

<template>
  <RouterView />
</template>
