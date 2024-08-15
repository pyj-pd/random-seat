<script setup lang="ts">
import SlideTransition from '@/components/common/SlideTransition.vue'
import NavigationBar from '@/components/picker/NavigationBar.vue'
import { MAX_SEAT_COLUMN_SIZE, MAX_SEAT_ROW_SIZE } from '@/constants/seat'
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { useHead } from '@unhead/vue'
import { watch } from 'vue'

useHead({
  title: '무작위 자리 뽑기',
  meta: [
    {
      name: 'description',
      content: `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리를 무작위로 배치해 보세요. 직관적인 UI를 통한 손쉬운 사용과 깔끔한 디자인을 통한 시각적 즐거움을 누려보세요.`,
    },
  ],
})

const sectionStore = useSectionStore()

const { currentSectionId, currentSectionData } = storeToRefs(sectionStore)

watch(currentSectionId, () => {
  window.scrollTo({
    top: 0,
  })
})
</script>

<template>
  <div :class="$style.container">
    <NavigationBar />
    <div :class="$style['view-container']">
      <SlideTransition>
        <component :class="$style.view" :is="currentSectionData.component"></component>
      </SlideTransition>
    </div>
  </div>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100vh;
}

.view-container {
  position: relative;

  flex: 1;
}

.view {
  position: absolute;

  width: 100%;
  min-height: 100%;

  padding: value.$view-padding;

  @media screen and (max-width: value.$small-screen-width) {
    & {
      padding: value.$small-screen-view-padding;
    }
  }
}
</style>
