<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  console.log(route.params)
})
</script>

<template>
  <main>wait for start man</main>
</template>
