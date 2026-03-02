<script lang="ts" setup>
import { useId } from 'vue'
import NormalButton from './NormalButton.vue'
import { Minus, Plus } from 'lucide-vue-next'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  label?: string
  showButtons?: boolean

  min: number
  max: number
  step: number
}>()

const model = defineModel<string | number>()

const id = useId()

const incrementValue = (amount: number) => {
  model.value = Math.min(props.max, Math.max(props.min, Number(model.value) + amount))
}
</script>

<template>
  <div :class="$style.container">
    <label v-if="label" :for="id" :class="$style.label">{{ label }}:</label>
    <div :class="$style['input-container']">
      <NormalButton
        v-if="showButtons"
        aria-label="감소"
        :class="$style.button"
        type="button"
        @click="incrementValue(-props.step)"
      >
        <Minus />
      </NormalButton>
      <input
        v-bind="$attrs"
        :id
        v-model="model"
        :class="$style.input"
        type="number"
        :min="props.min"
        :max="props.max"
        :step="props.step"
      />
      <NormalButton
        v-if="showButtons"
        aria-label="증가"
        :class="$style.button"
        type="button"
        @click="incrementValue(props.step)"
      >
        <Plus />
      </NormalButton>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  display: flex;
  align-items: center;
  gap: value.$button-container-small-gap;

  height: 35px;
}

.label {
  white-space: nowrap;
}

// Input
.input-container {
  display: flex;
  align-items: stretch;

  width: 100%;
  height: 100%;

  border-bottom: solid value.$border-width palette.$black;
}

.button {
  padding: 0;

  height: 100%;
  aspect-ratio: 1 / 1;

  border: none;

  > svg {
    height: 1em;
  }
}

.input {
  border: none;

  background: none;

  width: 100%;
  height: 100%;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  appearance: textfield;
}
</style>
