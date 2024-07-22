<template>
  <div :class="$style.container">
    <div :class="$style['shape-container']">
      <span :class="$style.shape"></span>
      <span :class="$style.shape"></span>
      <span :class="$style.shape"></span>
    </div>
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

$shape-size: 10px;
$shape-gap: 3px;

.shape-container {
  display: flex;
  gap: $shape-gap;

  width: fit-content;
}

$animation-delay: calc(value.$animation-duration / 1.5);

.shape {
  display: block;

  width: $shape-size;
  height: $shape-size;

  background-color: currentColor;

  animation: loading-animation 1s value.$ease-out infinite;

  &:nth-child(2) {
    animation-delay: $animation-delay;
  }

  &:nth-child(3) {
    animation-delay: calc($animation-delay * 2);
  }
}

@keyframes loading-animation {
  0%,
  100% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(2px);
  }
}
</style>
