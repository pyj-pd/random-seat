<script setup lang="ts">
import ShadowButton from '@/components/common/ShadowButton.vue'
import { DATA_ARE_SAVED_TEXT } from '@/constants/seat'
import { storeToRefs } from 'pinia'
import { onMounted, useTemplateRef } from 'vue'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import SectionTitle from '@/components/picker/SectionTitle.vue'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import { useOptionStore } from '@/stores/useOptionStore'
import { sections, type SectionId } from '@/constants/section'
import { ArrowRight, CircleQuestionMark, Trash2 } from 'lucide-vue-next'
import TableLayout from './TableLayout.vue'
import SeatSizeInput from './SeatSizeInput.vue'

const NEXT_SECTION: SectionId = 'name-settings'

const { setCurrentSectionId } = useSectionNavigation()

const tableLayoutRef = useTemplateRef('table-layout')

/**
 * Show mouse guide only on first time.
 * This will work on `onMounted` because we need initial data of `isFirstTime`
 * before actually changing the `isFirstTime` value.
 */
const optionStore = useOptionStore(),
  { isFirstTime } = storeToRefs(optionStore)

onMounted(() => {
  if (isFirstTime.value) tableLayoutRef.value?.showMouseGuide() // Show tooltip if first time

  isFirstTime.value = false
})
</script>

<template>
  <main :class="$style.container">
    <SectionTitle title="자리 배치를 설정해 주세요." :description="DATA_ARE_SAVED_TEXT" />
    <SeatSizeInput />
    <TableLayout ref="table-layout" />
    <ButtonContainer sticky>
      <ShadowButton warning @click="() => tableLayoutRef?.resetSeatData()">
        <Trash2 />
        자리 배치 초기화</ShadowButton
      >
      <ShadowButton @click="() => tableLayoutRef?.showMouseGuide()">
        <CircleQuestionMark />
        도움말 보기</ShadowButton
      >
      <ShadowButton @click="() => setCurrentSectionId(NEXT_SECTION)"
        >{{ sections[NEXT_SECTION].title }}으로
        <ArrowRight />
      </ShadowButton>
    </ButtonContainer>
  </main>
</template>

<style module lang="scss">
@use '@/styles/value' as value;

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: value.$container-gap;

  width: 100%;
  min-height: 700px;
}
</style>
