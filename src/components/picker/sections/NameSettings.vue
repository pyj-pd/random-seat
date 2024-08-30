<script setup lang="ts">
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import SectionTitle from '../SectionTitle.vue'
import { storeToRefs } from 'pinia'
import { useSectionStore } from '@/stores/useSectionStore'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import ShadowButton from '@/components/common/ShadowButton.vue'

const seatSizeStore = useSeatSizeStore()
const { totalSeatNumber, nameData } = storeToRefs(seatSizeStore)

const { setCurrentSectionId } = useSectionStore()

const validateTextarea = (event: KeyboardEvent) => {
  const target = event.target as HTMLTextAreaElement

  // If line exceeds total seat number, don't.
  const lineSplit = target.value.split('\n')

  if (lineSplit.length > totalSeatNumber.value) {
    lineSplit.splice(totalSeatNumber.value)
    target.value = lineSplit.join('\n')
  }
}
</script>

<template>
  <main :class="$style.container">
    <SectionTitle title="이름을 입력해 주세요(선택)." />
    <div :class="$style['textarea-container']">
      <div :class="$style['textarea-line-number-container']">
        <span v-for="i in totalSeatNumber" :key="i" :class="$style['textarea-line-number']" />
      </div>
      <textarea :class="$style.textarea" @keydown="validateTextarea" />
    </div>
    <ButtonContainer>
      <ShadowButton @click="() => setCurrentSectionId('random-pick-seat')"
        >뽑기 화면으로</ShadowButton
      >
    </ButtonContainer>
  </main>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: value.$container-gap;

  width: 100%;
}

// Textarea
.textarea-container {
  display: flex;
  gap: 10px;

  background-color: palette.$dark-gray;

  border: solid value.$border-width palette.$black;
  padding: 15px;

  width: 100%;
  max-width: 300px;
}

$line-number-height: 25px;

.textarea-line-number-container {
  display: flex;
  align-items: flex-end;
  flex-direction: column;

  counter-set: line-number;
}

.textarea-line-number {
  display: flex;
  align-items: center;

  height: $line-number-height;

  counter-increment: line-number;

  &::after {
    content: counter(line-number);
  }
}

.textarea {
  line-height: $line-number-height;

  resize: none;

  background-color: transparent;
  border: none;

  width: 100%;
}
</style>
