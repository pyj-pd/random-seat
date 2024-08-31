<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div :class="$style.title">
    <h2>{{ $props.title }}</h2>
    <p :class="$style.description" v-if="$props.description">{{ $props.description }}</p>
  </div>
</template>

<style module lang="scss">
.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;

  width: 100%;
}

.description {
  white-space: pre-wrap;
}
</style>
