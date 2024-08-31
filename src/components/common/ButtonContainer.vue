<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * Switch to vertical align if screen is too small.
     */
    responsive?: boolean
    sticky?: boolean
  }>(),
  {
    responsive: true,
    sticky: false,
  },
)
</script>

<template>
  <div
    :class="[
      $style.container,
      { [$style.responsive]: $props.responsive },
      { [$style.sticky]: $props.sticky },
    ]"
  >
    <slot></slot>
  </div>
</template>

<style module lang="scss">
@use '@/styles/value' as value;

.container {
  & {
    display: flex;
    justify-content: center;
    gap: value.$button-container-gap;

    white-space: nowrap;
  }

  @media screen and (max-width: value.$small-screen-width) {
    &.responsive {
      flex-direction: column;
      align-items: center;
    }
  }

  &.sticky {
    position: sticky;
    bottom: 0;

    width: 100%;

    padding: value.$button-container-margin 0;

    button {
      backdrop-filter: blur(value.$button-backdrop-blur);
    }
  }
}
</style>
