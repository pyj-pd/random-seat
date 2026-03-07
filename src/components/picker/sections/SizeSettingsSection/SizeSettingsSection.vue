<script setup lang="ts">
import ShadowButton from '@/components/common/ShadowButton.vue'
import { DATA_ARE_SAVED_TEXT } from '@/constants/seat'
import { useTemplateRef } from 'vue'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import SectionTitle from '@/components/picker/SectionTitle.vue'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import { sections, type SectionId } from '@/constants/section'
import { ArrowRight, Settings, Trash2 } from 'lucide-vue-next'
import TableLayout from './TableLayout.vue'
import SeatSizeInput from './SeatSizeInput.vue'

const NEXT_SECTION: SectionId = 'name-settings'
const PICKER_SECTION_ID: SectionId = 'random-pick-seat'

const { setCurrentSectionId } = useSectionNavigation()

const tableLayoutRef = useTemplateRef('table-layout')
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
      <ShadowButton @click="() => setCurrentSectionId(NEXT_SECTION)">
        <Settings />
        {{ sections[NEXT_SECTION].title }}
      </ShadowButton>
      <ShadowButton @click="() => setCurrentSectionId(PICKER_SECTION_ID)">
        {{ sections[PICKER_SECTION_ID].title }}으로
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
