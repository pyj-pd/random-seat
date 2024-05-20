<script setup lang="ts">
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
      <Transition name="view" :class="$style.view" mode="out-in">
        <component :is="currentSectionData.component" />
      </Transition>
    </div>
  </div>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;

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

  padding: 60px;
}
</style>

<style scoped lang="scss">
$enter-y: 20px;

.view-enter-active,
.view-leave-active {
  transition-duration: 0.5s;
  transition-property: transform, opacity;
}

.view-enter-active {
  transition-timing-function: ease-out;
}

.view-leave-active {
  transition-timing-function: ease-in;
  pointer-events: none;
}

.view-enter-from {
  transform: translateY($enter-y);
  opacity: 0;
}

.view-leave-to {
  transform: translateY(-$enter-y);
  opacity: 0;
}
</style>
