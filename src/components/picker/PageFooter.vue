<script setup lang="ts">
import { GITHUB_REPO_URL } from '@/constants/project'
import TextLink from '../common/TextLink.vue'
</script>

<template>
  <footer :class="$style.container">
    <p>
      이 프로그램은 오픈소스 프로그램입니다.
      <TextLink :href="GITHUB_REPO_URL">GitHub 레포지토리</TextLink>도 둘러보세요!
    </p>
  </footer>
</template>

<style lang="scss" module>
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

$vertical-padding: 30px;

.container {
  display: flex;
  align-items: center;

  width: 100%;

  border-top: solid value.$border-width palette.$black;

  padding: $vertical-padding value.$view-padding;

  @media screen and (max-width: value.$small-screen-width) {
    padding: $vertical-padding value.$small-screen-view-padding;
  }
}
</style>
