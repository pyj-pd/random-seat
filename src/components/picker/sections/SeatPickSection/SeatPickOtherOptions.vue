<script setup lang="ts">
import CheckboxInput from '@/components/common/CheckboxInput.vue'
import { useOptionStore } from '@/stores/useOptionStore'
import { storeToRefs } from 'pinia'

const { showSeatNumbers, invertVertical } = storeToRefs(useOptionStore())
</script>

<template>
  <section :class="$style.container">
    <CheckboxInput v-model="showSeatNumbers">이름 옆에 번호 표시</CheckboxInput>
    <CheckboxInput v-model="invertVertical">위아래 뒤집기</CheckboxInput>
  </section>
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
