<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const model = defineModel<boolean>()
</script>

<template>
  <label :class="$style.container">
    <input v-model="model" v-bind="$attrs" type="checkbox" />
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
