<script setup lang="ts">
import { BLOG_URL, GITHUB_REPO_URL, LICENSE_TEXT } from '@/constants/project'
import TextLink from '../common/TextLink.vue'
</script>

<template>
  <footer :class="$style.container">
    <div :class="$style['content-container']">
      <ul>
        <li>
          <p>
            Licensed under {{ LICENSE_TEXT }}
            <TextLink :href="GITHUB_REPO_URL" target="_blank" rel="noopener noreferrer"
              >GitHub 레포지토리</TextLink
            >
          </p>
        </li>
        <li>
          <p>제작: <TextLink :href="BLOG_URL">pyj-pd</TextLink></p>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style lang="scss" module>
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

$vertical-padding: 30px;

.container {
  display: flex;
  justify-content: center;

  width: 100%;

  border-top: solid value.$border-width palette.$black;

  padding: $vertical-padding value.$view-padding;

  @media screen and (max-width: value.$small-screen-width) {
    padding: $vertical-padding value.$small-screen-view-padding;
  }
}

.content-container {
  width: 100%;
  max-width: value.$fixed-width;
}
</style>
