<script setup lang="ts">
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import SlideTransition from '../common/SlideTransition.vue'
import { defaultSectionId } from '@/constants/section'

const sectionStore = useSectionStore()
const { navigateToLastSection } = sectionStore

const { currentSectionId, currentSectionData } = storeToRefs(sectionStore)

const isBackButtonVisible = computed<boolean>(() => currentSectionId.value !== defaultSectionId)

const titleRefresh = ref<number>(0)

watch(currentSectionId, () => {
  titleRefresh.value++
})
</script>

<template>
  <div :class="$style.container">
    <div :class="$style['back-button-container']">
      <Transition name="back-button">
        <button
          v-if="isBackButtonVisible"
          @click="navigateToLastSection"
          aria-label="뒤로가기"
          :class="$style['back-button']"
        >
          <span :class="$style['back-arrow-icon']"></span>
        </button>
      </Transition>
    </div>
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

.container {
  display: flex;
  gap: 15px;
  align-items: center;

  background-color: palette.$white;
  border-bottom: solid value.$border-width palette.$black;

  padding: 15px value.$view-padding;

  width: 100%;
}

.back-button-container {
  display: flex;

  width: 45px;
  height: 45px;
}

.back-button {
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  border: none;

  background-color: palette.$white;

  width: 100%;
  height: 100%;
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

<style scoped lang="scss">
.back-button-enter-active,
.back-button-leave-active {
  transition: 0.5s ease-in-out;
}

.back-button-enter-from,
.back-button-leave-to {
  opacity: 0;
}
</style>
