<script setup lang="ts">
import type { AnchorHTMLAttributes } from 'vue'

type TextLinkProps = /* @vue-ignore */ AnchorHTMLAttributes

defineProps<TextLinkProps>()
</script>

<template>
  <a v-bind="$props" :class="$style.a"><slot></slot></a>
</template>

<style lang="scss" module>
@use '@/styles/palette' as palette;

.a {
  position: relative;

  font-weight: 700;

  background-color: rgba(palette.$green, 0.17);
  color: palette.$green;
}
</style>
