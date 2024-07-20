<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    reshowKey?: number
    /**
     * Whether to start animation immediately after mounting.
     * Set to `false` if you are trying to control only with `reshowKey` prop.
     * Default value is `true`.
     */
    immediate?: boolean
  }>(),
  {
    reshowKey: 0,
    immediate: true,
  },
)

const reshowUpdates = ref<number>(0)

watch(
  () => props.reshowKey,
  () => reshowUpdates.value++,
)
</script>

<template>
  <div :class="$style.container" :key="$props.reshowKey" v-if="immediate || reshowUpdates !== 0">
    <span>{{ $props.text }}</span>
  </div>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

$background-color: palette.$black;

.container {
  position: absolute;
  top: 50%;
  left: 90%;
  z-index: 10;

  display: flex;

  white-space: nowrap;

  padding: 7px 12px;

  background-color: $background-color;
  color: palette.$white;

  pointer-events: none;
  transform-origin: 0% 0%;
  animation: tooltip-pop-up-animation 5s value.$ease-in-out both;

  &::before {
    $arrow-size: 7px;
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-100%);

    width: $arrow-size;
    height: $arrow-size;

    background-color: $background-color;

    clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
  }
}

@keyframes tooltip-pop-up-animation {
  0%,
  100% {
    transform: scale(0.85);
    opacity: 0;
  }
  5%,
  95% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
