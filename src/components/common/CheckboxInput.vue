<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'

type CheckboxProps = /* @vue-ignore */ InputHTMLAttributes

defineProps<CheckboxProps>()

// Model
const model = defineModel({ type: Boolean })
</script>

<template>
  <label :class="$style.container">
    <input v-model="model" v-bind="$props" type="checkbox" />
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
