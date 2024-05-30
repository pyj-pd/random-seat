<script setup lang="ts">
import SlideTransition from '@/components/common/SlideTransition.vue'
import NavigationBar from '@/components/home/NavigationBar.vue'
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { useHead } from 'unhead'

useHead({
  title: '무작위 자리 뽑기',
})

const sectionStore = useSectionStore()

const { currentSectionData } = storeToRefs(sectionStore)
</script>

<template>
  <div :class="$style.container">
    <NavigationBar />
    <div :class="$style['view-container']">
      <SlideTransition :class="$style.view">
        <component :is="currentSectionData.component"></component>
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
}
</style>
