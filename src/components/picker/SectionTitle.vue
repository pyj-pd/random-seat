<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div :class="$style.title">
    <h3>{{ $props.title }}</h3>
    <p v-if="$props.description" :class="$style.description">{{ $props.description }}</p>
  </div>
</template>

<style module lang="scss">
@use '@/styles/value' as value;

.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;

  width: 100%;
  max-width: value.$fixed-width;

  h3 {
    font-size: 1.4rem;
  }
}

.description {
  white-space: pre-wrap;
}
</style>
