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
  <div :class="$style.container">
    <button
      v-bind="$props"
      :class="[$style.button, { [$style.warning]: warning }, { [$style.loading]: loading }]"
    >
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
  @include button.button-common-styles();

  &.warning {
    @include button.button-warning-styles();
  }

  &.loading {
    & > .slot {
      visibility: hidden;
    }
  }

  &:disabled {
    @include button.button-disabled-styles();
  }

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
