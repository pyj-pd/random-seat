<template>
  <svg
    :class="$style.svg"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    fill="transparent"
    stroke="currentColor"
    stroke-width="10"
  >
    <path d="M0,0 L100,100 Z" />
    <path d="M0,100 L100,0 Z" />
  </svg>
</template>

<style module lang="scss">
.svg {
  width: 100%;
  height: 100%;
}
</style>
