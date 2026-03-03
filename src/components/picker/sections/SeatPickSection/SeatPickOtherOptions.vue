<script setup lang="ts">
import CheckboxInput from '@/components/common/CheckboxInput.vue'
import { useOptionStore } from '@/stores/useOptionStore'
import { storeToRefs } from 'pinia'

const { showSeatNumbers } = storeToRefs(useOptionStore())
</script>

<template>
  <div :class="$style.container">
    <CheckboxInput v-model="showSeatNumbers">이름 옆에 번호 표시</CheckboxInput>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: value.$button-container-small-gap;
}
</style>
