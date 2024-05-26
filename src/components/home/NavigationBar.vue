<script setup lang="ts">
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'

const sectionStore = useSectionStore()
const { setCurrentSectionId } = sectionStore

const { currentSectionData, lastSectionId } = storeToRefs(sectionStore)

/**
 * Move to last section.
 */
const goBack = () => lastSectionId.value && setCurrentSectionId(lastSectionId.value)
</script>

<template>
  <div :class="$style.container">
    <button @click="goBack">뒤로</button>
    <span>{{ currentSectionData.title }}</span>
  </div>
</template>

<style module lang="scss">
.container {
  background-color: red;

  width: 100%;
}
</style>
