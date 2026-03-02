<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * When this value is set to 0, it will be invisible.
     */
    reshowKey?: number
  }>(),
  {
    reshowKey: 0,
  },
)

defineSlots()

const reshowUpdates = ref<number>(0)
const isVisible = ref<boolean>(false)

watch(
  () => props.reshowKey,
  () => {
    reshowUpdates.value++
    isVisible.value = true
  },
)

const onAnimationEnd = () => (isVisible.value = false)
</script>

<template>
  <div v-if="isVisible" :class="$style.container" @animationend="onAnimationEnd">
    <div v-if="reshowUpdates !== 0" :key="$props.reshowKey" :class="$style.tooltip">
      <slot />
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

  text-align: center;
  white-space: nowrap;

  padding: 7px 12px;

  background-color: $background-color;
  color: palette.$white;

  font-weight: normal;

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
