<script setup lang="ts">
import { useId } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const model = defineModel<boolean>()

const id = useId()
</script>

<template>
  <label :class="$style.container" :for="id">
    <input v-bind="$attrs" :id v-model="model" type="checkbox" />
    <slot></slot>
  </label>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.container {
  display: flex;
  gap: value.$button-container-small-gap;
  align-items: center;
}
</style>
