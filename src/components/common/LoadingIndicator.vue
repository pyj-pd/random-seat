<template>
  <div :class="$style.container">
    <span :class="$style.indicator"></span>
  </div>
</template>

<style module lang="scss">
@use '@/styles/value' as value;

.container {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
}

$indicator-size: 10px;

.indicator {
  position: absolute;

  display: block;

  width: $indicator-size;
  height: $indicator-size;

  background-color: currentColor;

  border-radius: 100%;

  animation: loading-animation 1s value.$ease-out infinite;
}

@keyframes loading-animation {
  0%,
  100% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
}
</style>
