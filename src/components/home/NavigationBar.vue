<script setup lang="ts">
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'

const sectionStore = useSectionStore()

const { currentSectionData } = storeToRefs(sectionStore)
</script>

<template>
  <div :class="$style.container">{{ currentSectionData.title }}</div>
</template>

<style module lang="scss">
.container {
  background-color: red;

  width: 100%;
}
</style>
