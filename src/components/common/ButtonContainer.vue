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
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  & {
    display: flex;
    justify-content: center;
    gap: value.$button-container-gap;

    white-space: nowrap;
  }

  &.responsive {
    flex-wrap: wrap;
  }

  &.sticky {
    position: sticky;
    bottom: value.$button-container-margin;
    z-index: 20;

    width: 100%;
  }
}
</style>
