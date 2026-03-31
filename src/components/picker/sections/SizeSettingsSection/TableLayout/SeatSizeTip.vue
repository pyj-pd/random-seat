<script setup lang="ts">
import { Info } from 'lucide-vue-next'

withDefaults(defineProps<{ mode?: 'exclude' | 'fix' }>(), { mode: 'exclude' })
</script>

<template>
  <div :class="$style.container">
    <template v-if="mode === 'exclude'">
      <Info />
      <span>자리를 클릭하여 <strong>해당 자리를 제외</strong>할 수 있어요.</span>
    </template>
    <template v-else-if="mode === 'fix'">
      <Info />
      <strong :class="$style.highlight">고정 자리 설정 중</strong>
      <span>자리를 클릭하여 <strong>해당 자리 번호 배정을 고정</strong>할 수 있어요.</span>
    </template>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

.container {
  display: flex;
  align-items: center;
  gap: value.$button-container-small-gap;
  flex-wrap: wrap;

  font-size: 1.1rem;
}

.highlight {
  font-weight: bold;

  background-color: palette.$green;
  color: palette.$white;

  padding: 0 0.2em;
}
</style>
