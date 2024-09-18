<script setup lang="ts">
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import NormalButton from '@/components/common/NormalButton.vue'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import SlideTransition from '../common/SlideTransition.vue'

const sectionStore = useSectionStore()
const { currentSectionIndex, currentSectionId, currentSectionData } = storeToRefs(sectionStore)

const { setCurrentSectionIndex } = useSectionNavigation()

const isBackButtonVisible = computed(() => currentSectionIndex.value > 0)

const navigateToLastSection = () => setCurrentSectionIndex(currentSectionIndex.value - 1)

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
    <div :class="$style['back-button-container']">
      <Transition name="back-button">
        <NormalButton
          v-if="isBackButtonVisible"
          @click="navigateToLastSection"
          aria-label="뒤로가기"
          :class="$style['back-button']"
          :animation="false"
        >
          <span :class="$style['back-arrow-icon']"></span>
        </NormalButton>
      </Transition>
    </div>
    <div :class="$style['title-container']">
      <SlideTransition enter-y="5px">
        <span :key="titleRefresh" :class="$style.title">{{ currentSectionData.title }}</span>
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

  border-bottom: solid value.$border-width palette.$black;

  padding: 15px value.$view-padding;

  width: 100%;

  @media screen and (max-width: value.$small-screen-width) {
    padding: 15px value.$small-screen-view-padding;
  }
}

.back-button-container {
  display: flex;

  width: 45px;
  height: 45px;
}

.back-button {
  width: 100%;
  height: 100%;

  padding: 0;
  border: none;
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
  & {
    position: relative;
  }

  .title {
    display: block;

    font-weight: bold;
  }
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
