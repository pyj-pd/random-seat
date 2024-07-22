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
  justify-items: center;
  align-items: center;

  width: 100%;
  height: 100%;
}

$shape-size: 10px;
$shape-gap: 3px;

.shape-container {
  diplay: flex;
  gap: $shape-gap;
}

$animation-delay: 0.5s;

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
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.3);
  }
}
</style>
