<script setup lang="ts">
import { type ButtonHTMLAttributes } from 'vue'

interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  disabled?: boolean
  animation?: boolean
  vertical?: boolean
}

withDefaults(defineProps<ButtonProps>(), {
  animation: true,
})
</script>

<template>
  <button
    v-bind="$props"
    :class="[
      $style.button,
      { [$style.animated]: $props.animation },
      { [$style.vertical]: $props.vertical },
    ]"
  >
    <slot></slot>
  </button>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;
@use '@/styles/button' as button;

.button {
  @include button.button-common-styles();
}

// Animation is on
.button.animated {
  &::after {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;

    transform: scaleX(0);
    transform-origin: left center;

    width: 100%;
    height: 100%;

    background-color: palette.$black;

    transition: transform value.$animation-duration value.$animation-ease;
  }

  // Vertical
  &.vertical::after {
    transform: scaleY(0);
    transform-origin: center bottom;
  }

  & {
    transition: color value.$animation-duration value.$animation-ease;
  }

  &:hover {
    color: palette.$white;

    &::after {
      transform: scaleX(1);
    }
    &.vertical::after {
      transform: scaleY(1);
    }
  }
}
</style>
