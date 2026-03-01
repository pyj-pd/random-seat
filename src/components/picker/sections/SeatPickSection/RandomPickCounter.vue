<script setup lang="ts">
defineProps<{
  pickCount: number
}>()
</script>

<template>
  <div :class="$style['random-pick-counter']">
    <span v-if="pickCount > 0" :key="pickCount">{{ pickCount }}번째 추첨</span>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.random-pick-counter {
  & > span {
    display: flex;
    justify-content: center;
    align-items: center;

    white-space: nowrap;

    font-size: 2rem;
    font-weight: 900;

    padding: 25px 60px;

    background-color: palette.$black;
    color: palette.$white;

    animation: random-pick-counter-animation 2s value.$ease-in-out both;

    user-select: none;
  }

  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    pointer-events: none;
  }
}

@keyframes random-pick-counter-animation {
  0%,
  100% {
    transform: scaleY(0);
  }
  10%,
  90% {
    transform: scaleY(1);
  }
}
</style>
