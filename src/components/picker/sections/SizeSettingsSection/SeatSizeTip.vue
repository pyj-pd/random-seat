<script setup lang="ts">
import { Info } from 'lucide-vue-next'

withDefaults(defineProps<{ isVisible?: boolean }>(), { isVisible: true })
</script>

<template>
  <div :class="[$style.container, { [$style.hidden]: !isVisible }]">
    <Info />
    <span> 자리를 클릭하여 <strong>해당 자리를 제외</strong>할 수 있어요. </span>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.container {
  display: flex;
  gap: value.$button-container-small-gap;

  font-size: 1.1rem;

  &.hidden {
    visibility: hidden;
  }
}
</style>
