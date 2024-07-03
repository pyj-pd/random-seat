<script setup lang="ts">
import { type ButtonHTMLAttributes } from 'vue'

interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  disabled?: boolean /** @todo Disabled styles */
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
@use '@/styles/value' as value;
@use '@/styles/button' as button;

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

  transition: transform value.$animation-duration value.$animation-ease;
}

.button {
  @include button.button-default-styles();

  &::after {
    content: '';

    position: absolute;
    z-index: -1;
    top: calc(-1 * value.$border-width);
    left: calc(-1 * value.$border-width);

    box-sizing: content-box;
    padding: value.$border-width;

    clip-path: polygon(
      calc(100% - var(--v-shadow-depth)) 0%,
      100% var(--v-shadow-depth),
      100% 100%,
      var(--v-shadow-depth) 100%,
      0% calc(100% - var(--v-shadow-depth)),
      calc(100% - var(--v-shadow-depth)) calc(100% - var(--v-shadow-depth))
    );

    background-color: currentColor;

    width: calc(100% + var(--v-shadow-depth));
    height: calc(100% + var(--v-shadow-depth));

    transition: all value.$animation-duration value.$animation-ease;
  }
}
</style>
