<script setup lang="ts">
import { Info } from 'lucide-vue-next'
</script>

<template>
  <div :class="$style.container">
    <Info />
    <span> 자리를 클릭하여 <strong>해당 자리를 제외</strong>할 수 있어요. </span>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.container {
  display: flex;
  gap: value.$button-container-small-gap;
}
</style>
