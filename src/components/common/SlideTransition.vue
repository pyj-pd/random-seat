<script setup lang="ts">
withDefaults(
  defineProps<{
    enterY?: string
    duration?: number
  }>(),
  {
    enterY: '7px',
    duration: 0.35,
  },
)
</script>

<template>
  <Transition name="slide-transition" class="slide-transition" mode="out-in">
    <slot></slot>
  </Transition>
</template>

<style lang="scss">
@use '@/styles/value' as value;

.slide-transition {
  --enter-y: v-bind('$props.enterY');
  --duration: calc(v-bind('$props.duration') * 1s);
}

.slide-transition-enter-active,
.slide-transition-leave-active {
  transition-duration: var(--duration);
  transition-property: transform, opacity;
}

.slide-transition-enter-active {
  transition-timing-function: value.$ease-out;
}

.slide-transition-leave-active {
  transition-timing-function: value.$ease-in;
  pointer-events: none;
}

.slide-transition-enter-from {
  transform: translateY(var(--enter-y));
  opacity: 0;
}

.slide-transition-leave-to {
  transform: translateY(calc(-1 * var(--enter-y)));
  opacity: 0;
}
</style>
