<script setup lang="ts">
import CustomButton from '@/components/common/CustomButton.vue'
import { useSectionStore } from '@/stores/useSectionStore'

const { setCurrentSectionId } = useSectionStore()
</script>

<template>
  <main :class="$style.container">
    <h2 :class="$style.title">무작위 자리 뽑기</h2>
    <CustomButton @click="() => setCurrentSectionId('size-settings')">시작하기</CustomButton>
  </main>
</template>

<style module lang="scss">
.container {
  display: grid;
  gap: 20px;
  justify-items: left;
  align-content: center;
}

.title {
  font-size: 2.5em;
}
</style>
