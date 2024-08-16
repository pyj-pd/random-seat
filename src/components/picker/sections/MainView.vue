<script setup lang="ts">
import ShadowButton from '@/components/common/ShadowButton.vue'
import { useSectionStore } from '@/stores/useSectionStore'
import GitHubIcon from '../GitHubIcon.vue'
import { PROJECT_REPO_URL } from '@/constants/project'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import type { PickerRouteName } from '@/router'
import { getRouteMetadata } from '@/utils/route'
import { useRoute } from 'vue-router'

const { setCurrentSectionId } = useSectionStore()

const route = useRoute(),
  { title } = getRouteMetadata(route.name as PickerRouteName)
</script>

<template>
  <main :class="$style.container">
    <h2 :class="$style.title">{{ title }}</h2>
    <ButtonContainer :responsive="false" :class="$style['button-container']">
      <ShadowButton @click="() => setCurrentSectionId('size-settings')">시작하기</ShadowButton>
    </ButtonContainer>
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

.link-container {
  > a {
    color: inherit;
  }
}
</style>
