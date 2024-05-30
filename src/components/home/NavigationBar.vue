<script setup lang="ts">
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import SlideTransition from '../common/SlideTransition.vue'

const sectionStore = useSectionStore()
const { setCurrentSectionId } = sectionStore

const { currentSectionId, currentSectionData, lastSectionId } = storeToRefs(sectionStore)

/**
 * Move to last section.
 */
const goBack = () => lastSectionId.value && setCurrentSectionId(lastSectionId.value)

const titleRefresh = ref<number>(0)

watch(currentSectionId, () => {
  titleRefresh.value++
})
</script>

<template>
  <div :class="$style.container">
    <button @click="goBack" aria-label="뒤로가기" :class="$style['back-button']">
      <span :class="$style['back-arrow-icon']"></span>
    </button>
    <div :class="$style['title-container']">
      <SlideTransition enter-y="5px">
        <span :key="titleRefresh" :class="$style['section-title']">{{
          currentSectionData.title
        }}</span>
      </SlideTransition>
    </div>
  </div>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;
@use '@/styles/zindex' as zindex;

.container {
  position: absolute;
  z-index: zindex.$navigation-bar;
  top: 0;
  left: 0;

  display: flex;
  gap: 15px;
  align-items: center;

  background-color: palette.$white;
  border-bottom: solid value.$border-width palette.$black;

  padding: 15px value.$view-padding;

  width: 100%;
}

.back-button {
  cursor: pointer;

  border: solid value.$border-width currentColor;
  background: none;

  padding: 10px;
}

.back-arrow-icon {
  display: block;

  transform: translateX(25%) rotate(45deg);

  width: 1em;
  height: 1em;

  border: solid currentColor;
  border-width: 0 0 value.$border-width value.$border-width;
}

.title-container {
  position: relative;
}

.section-title {
  display: block;

  font-weight: bold;
}
</style>
