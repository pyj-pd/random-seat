<script setup lang="ts">
import SlideTransition from '@/components/common/SlideTransition.vue'
import NavigationBar from '@/components/picker/navigation/NavigationBar.vue'
import type { PickerRouteName } from '@/router'
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'

const sectionStore = useSectionStore()
const router = useRouter()

const { _currentRouteHash, currentSectionId, currentSectionData, pickerType } =
  storeToRefs(sectionStore)

onBeforeMount(() => {
  pickerType.value = router.currentRoute.value.name as PickerRouteName
})

/**
 * Interact with section store after each navigation.
 */
router.afterEach((to) => {
  // Set current section hash
  _currentRouteHash.value = to.hash
})

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
        <!-- Sections will change here -->
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
