<script setup lang="ts">
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import { ROUTE_HASH_PREFIX, sections } from '@/constants/section'

const sectionStore = useSectionStore()
const { currentSectionIndex, currentSectionId } = storeToRefs(sectionStore)
</script>

<template>
  <nav :class="$style.container">
    <div :class="$style['route-container']">
      <template v-for="(section, sectionId, index) in sections" :key="sectionId">
        <a
          :href="`${ROUTE_HASH_PREFIX}${sectionId}`"
          :class="[
            $style['route-link'],
            { [$style['active']]: currentSectionIndex >= index },
            { [$style['current']]: currentSectionIndex === index },
          ]"
          :aria-current="currentSectionId === sectionId ? 'step' : undefined"
          >{{ index + 1 }}. {{ section.title }}</a
        >
        <span
          v-if="index < Object.keys(sections).length - 1"
          :class="[$style['route-separator'], { [$style['active']]: currentSectionIndex > index }]"
        ></span>
      </template>
    </div>
  </nav>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;
@use 'sass:color';

$vertical-padding: 20px;

.container {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;

  display: flex;
  justify-content: center;

  border-bottom: solid value.$border-width palette.$black;
  background-color: palette.$white;

  width: 100%;

  padding: $vertical-padding value.$view-padding;

  @media screen and (max-width: value.$small-screen-width) {
    padding: $vertical-padding value.$small-screen-view-padding;
  }
}

$active-route-color: palette.$black;
$inactive-route-color: color.scale($active-route-color, $alpha: -60%);

.route-container {
  position: relative;

  display: flex;
  align-items: center;
  gap: value.$button-container-gap;

  overflow-x: auto;

  color: $inactive-route-color;
}

.route-link {
  display: block;

  font-weight: bold;
  font-size: 1rem;

  text-decoration: none;

  white-space: nowrap;

  color: currentColor;

  transition: color value.$animation-duration value.$animation-ease;

  &.active {
    color: $active-route-color;
  }

  &:focus-visible,
  &:hover {
    text-decoration: underline;
  }
}

.route-separator {
  display: block;

  width: 150px;
  max-width: 100%;
  min-width: 30px;
  height: 2px;

  background: linear-gradient(to right, currentColor 50%, $active-route-color 50%);
  background-size: 200% 100%;
  background-position-x: 0%;

  transition: background-position-x value.$animation-duration value.$animation-ease;

  &.active {
    background-position-x: -100%;
  }
}
</style>
