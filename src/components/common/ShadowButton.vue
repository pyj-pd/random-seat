<script setup lang="ts">
import { type ButtonHTMLAttributes } from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'

interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  disabled?: boolean
  warning?: boolean
  loading?: boolean
}

defineProps<ButtonProps>()
</script>

<template>
  <div :class="[$style.container, { [$style.disabled]: disabled }, { [$style.warning]: warning }]">
    <span :class="$style.shadow" />
    <button v-bind="$props" :class="[$style.button, { [$style.loading]: loading }]">
      <div :class="$style.slot">
        <slot></slot>
      </div>
      <LoadingIndicator v-if="loading" />
    </button>
  </div>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;
@use '@/styles/button' as button;

$initial-shadow-depth: 4px;
$animation-duration: 0.1s;

.container {
  --v-shadow-depth: #{$initial-shadow-depth};

  // Enabled styles
  &:not(.disabled) {
    &:hover {
      --v-shadow-depth: #{calc($initial-shadow-depth / 2)};
    }

    &:active {
      --v-shadow-depth: 0px;
    }
  }

  // Disabled styles
  &.disabled {
    opacity: button.$button-disabled-opacity;
  }

  &.warning {
    color: button.$warning-button-color;
  }

  & {
    position: relative;

    transform: translate(
      calc($initial-shadow-depth - var(--v-shadow-depth)),
      calc($initial-shadow-depth - var(--v-shadow-depth))
    );

    transition: transform $animation-duration value.$animation-ease;
  }
}

.shadow {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;

  clip-path: polygon(
    calc(100% - var(--v-shadow-depth)) 0%,
    100% var(--v-shadow-depth),
    100% 100%,
    var(--v-shadow-depth) 100%,
    0% calc(100% - var(--v-shadow-depth)),
    0% 0%
  );

  background-color: currentColor;

  width: calc(100% + var(--v-shadow-depth));
  height: calc(100% + var(--v-shadow-depth));

  transition: all $animation-duration value.$animation-ease;
}

.button {
  @include button.button-common-styles();

  &.loading {
    & > .slot {
      visibility: hidden;
    }
  }
}

.slot {
  display: flex;
  gap: value.$button-container-small-gap;
  justify-content: center;
  align-items: center;

  > svg {
    width: auto;
    height: 1.2em;
  }
}
</style>
