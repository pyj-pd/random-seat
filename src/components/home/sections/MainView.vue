<script setup lang="ts">
import CustomButton from '@/components/common/ShadowButton.vue'
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
@use '@/styles/value' as value;

.container {
  display: grid;
  gap: 20px;
  justify-items: left;
  align-content: center;
}

.title {
  font-size: 2.5em;
  letter-spacing: -0.05em;

  animation: title-animation 0.5s value.$ease-out 0.2s 1 both;
}

@keyframes title-animation {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
