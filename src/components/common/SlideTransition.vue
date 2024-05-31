<script setup lang="ts">
withDefaults(
  defineProps<{
    enterY?: string
    duration?: number
  }>(),
  {
    enterY: '15px',
    duration: 0.25,
  },
)
</script>

<template>
  <Transition name="slide-transition" class="slide-transition" mode="out-in">
    <slot></slot>
  </Transition>
</template>

<style scoped lang="scss">
.slide-transition {
  --enter-y: v-bind('$props.enterY');
  --duration: v-bind('$props.duration');
}

.slide-transition-enter-active,
.slide-transition-leave-active {
  transition-duration: calc(var(--duration) * 1s);
  transition-property: transform, opacity;
}

.slide-transition-enter-active {
  transition-timing-function: ease-out;
}

.slide-transition-leave-active {
  transition-timing-function: ease-in;
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
