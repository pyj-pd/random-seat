<script setup lang="ts">
import ShadowButton from '@/components/common/ShadowButton.vue'
import { useSectionStore } from '@/stores/useSectionStore'
import GitHubIcon from '../GitHubIcon.vue'
import { PROJECT_REPO_URL } from '@/constants/project'

const { setCurrentSectionId } = useSectionStore()
</script>

<template>
  <main :class="$style.container">
    <h2 :class="$style.title">무작위 자리 뽑기</h2>
    <div :class="$style['button-container']">
      <ShadowButton @click="() => setCurrentSectionId('size-settings')">시작하기</ShadowButton>
    </div>
    <div :class="$style['link-container']">
      <a :href="PROJECT_REPO_URL" target="_blank">
        <GitHubIcon :height="17" />
      </a>
    </div>
  </main>
</template>

<style module lang="scss">
@use '@/styles/value' as value;

.container {
  display: grid;
  gap: 20px;
  justify-items: left;
  align-content: center;
}

.title {
  font-size: 2.5em;
  letter-spacing: -0.05em;

  animation: title-animation 0.5s value.$ease-out 0.2s 1 both;
}

@keyframes title-animation {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}

.button-container,
.link-container {
  display: flex;
  gap: value.$button-container-gap;
  align-items: center;
}

.link-container > a {
  color: inherit;
}
</style>
