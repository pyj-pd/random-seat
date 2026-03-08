<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useId } from 'vue'
import NormalButton from './NormalButton.vue'

const isChecked = defineModel<boolean>()

const id = useId()

const handleCheckbox = () => {
  isChecked.value = !isChecked.value
}
</script>

<template>
  <div :class="$style.container">
    <NormalButton
      :aria-checked="isChecked"
      role="checkbox"
      :class="$style.checkbox"
      :aria-labelledby="id"
      type="button"
      @click="handleCheckbox"
    >
      <Check />
    </NormalButton>
    <label :id @click="handleCheckbox">
      <slot></slot>
    </label>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;

.container {
  display: flex;
  gap: 7px;
  align-items: center;

  user-select: none;
}

.checkbox {
  height: 1.5em;
  aspect-ratio: 1 / 1;
  padding: 0;

  > svg {
    visibility: hidden;

    width: 100%;
    height: 100%;
  }

  &[aria-checked='true'] > svg {
    visibility: visible;
  }
}
</style>
