<script setup lang="ts">
import { type ButtonHTMLAttributes, type PropType } from 'vue'

interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  disabled?: boolean
}

defineProps<ButtonProps>()
</script>

<template>
  <div :class="$style.container">
    <button v-bind="$props" :class="$style.button"><slot></slot></button>
  </div>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;

$border-width: 2px;
$initial-shadow-depth: 4px;
$animation-duration: 0.1s;

.container {
  --v-shadow-depth: #{$initial-shadow-depth};

  &:hover {
    --v-shadow-depth: #{calc($initial-shadow-depth / 2)};
  }

  &:active {
    --v-shadow-depth: 0px;
  }

  transform: translate(
    calc($initial-shadow-depth - var(--v-shadow-depth)),
    calc($initial-shadow-depth - var(--v-shadow-depth))
  );

  transition: transform $animation-duration;
}

.button {
  position: relative;

  display: inline-block;

  padding: 8px 25px;

  font-weight: 500;
  font-size: 1rem;

  color: palette.$black;
  background-color: palette.$white;

  cursor: pointer;

  border: solid $border-width currentColor;

  &::after {
    content: '';

    position: absolute;
    z-index: -1;
    top: -$border-width;
    left: -$border-width;

    box-sizing: content-box;
    padding: $border-width;

    clip-path: polygon(
      0% 0%,
      calc(100% - var(--v-shadow-depth)) 0%,
      100% var(--v-shadow-depth),
      100% 100%,
      var(--v-shadow-depth) 100%,
      0% calc(100% - var(--v-shadow-depth))
    );

    background-color: currentColor;

    width: calc(100% + var(--v-shadow-depth));
    height: calc(100% + var(--v-shadow-depth));

    transition: all $animation-duration;
  }
}
</style>
