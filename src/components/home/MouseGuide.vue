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

const reshowUpdates = ref<number>(0),
  /**
   * Whether the tooltip component has unmounted.
   *
   * Default value is the `immediate` prop value because if `immediate` value is set to `false`,
   * it should be not mounted anyways.
   */
  isUnmounted = ref<boolean>(!props.immediate)

watch(
  () => props.reshowKey,
  () => {
    reshowUpdates.value++
    isUnmounted.value = false
  },
)

const onAnimationEnd = () => (isUnmounted.value = true)
</script>

<template>
  <div :class="$style.container" v-if="!isUnmounted" @animationend="onAnimationEnd">
    <div :class="$style.tooltip" :key="$props.reshowKey" v-if="immediate || reshowUpdates !== 0">
      <span>{{ $props.text }}</span>
    </div>
  </div>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

$background-color: palette.$black;

.container {
  position: absolute;
  top: calc(100% - 5px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.tooltip {
  position: relative;
  display: flex;

  text-align: center;
  white-space: nowrap;

  padding: 7px 12px;

  background-color: $background-color;
  color: palette.$white;

  pointer-events: none;
  transform-origin: 50% 0%;
  animation: tooltip-pop-up-animation 5s value.$ease-in-out both;

  &::before {
    $arrow-size: 7px;
    content: '';

    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);

    width: $arrow-size;
    height: $arrow-size;

    background-color: $background-color;

    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
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
