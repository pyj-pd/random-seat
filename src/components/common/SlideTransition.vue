<script setup lang="ts">
withDefaults(
  defineProps<{
    enterY?: string
  }>(),
  {
    enterY: '20px',
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
}

.slide-transition-enter-active,
.slide-transition-leave-active {
  transition-duration: 0.5s;
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
