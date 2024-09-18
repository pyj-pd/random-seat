<script setup lang="ts">
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import SlideTransition from '@/components/common/SlideTransition.vue'

const { currentSectionData, currentSectionId } = storeToRefs(useSectionStore())

/**
 * Slide transition each time section changes
 */
const titleRefresh = ref<number>(0)

watch(currentSectionId, () => {
  titleRefresh.value++
})
</script>

<template>
  <div :class="$style.container">
    <SlideTransition enter-y="5px">
      <span :key="titleRefresh" :class="$style.title">{{ currentSectionData.title }}</span>
    </SlideTransition>
  </div>
</template>

<style lang="scss" module>
.container {
  position: relative;
}

.title {
  display: block;

  font-weight: bold;
}
</style>
