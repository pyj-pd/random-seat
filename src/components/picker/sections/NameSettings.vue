<script setup lang="ts">
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import SectionTitle from '../SectionTitle.vue'
import { storeToRefs } from 'pinia'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import ShadowButton from '@/components/common/ShadowButton.vue'
import { DATA_ARE_SAVED_TEXT, NAME_LINE_BREAK } from '@/constants/seat'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import CheckboxInput from '@/components/common/CheckboxInput.vue'
import { useOptionStore } from '@/stores/useOptionStore'

const seatDataStore = useSeatDataStore(),
  { setNameData, clearNameData } = seatDataStore,
  { totalSeatNumber, nameDataString } = storeToRefs(seatDataStore)

const optionStore = useOptionStore(),
  { showSeatNumbers } = storeToRefs(optionStore)

const { setCurrentSectionId } = useSectionNavigation()

/**
 * Detect if text input exceeds max line
 * and trim if it does.
 * @param event
 */
const validateTextarea = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const lineSplit: string[] = target.value.split(NAME_LINE_BREAK)

  // If line exceeds total seat number, don't.
  if (lineSplit.length > totalSeatNumber.value) {
    const { selectionStart, selectionEnd } = target

    lineSplit.splice(totalSeatNumber.value)

    target.value = lineSplit.join(NAME_LINE_BREAK)
    target.setSelectionRange(selectionStart, selectionEnd)
  }
}

const updateNameData = (event: Event) => {
  validateTextarea(event)
  setNameData((event.target as HTMLInputElement).value)
}
</script>

<template>
  <main :class="$style.container">
    <SectionTitle
      title="이름을 입력해 주세요(선택)."
      :description="`각 번호에 이름은 최대 4글자까지만 입력할 수 있습니다.\n모든 번호에 이름이 대응되지 않아도 됩니다.\n${DATA_ARE_SAVED_TEXT}`"
    />
    <div :class="$style['content-container']">
      <div :class="$style['option-container']">
        <CheckboxInput v-model="showSeatNumbers">자리 옆에 번호 표시하기</CheckboxInput>
      </div>
      <div :class="$style['textarea-container']">
        <div :class="[$style['textarea-line-container'], !showSeatNumbers && $style.hidden]">
          <div v-for="i in totalSeatNumber" :key="i" :class="$style['textarea-line']">
            <span></span>
          </div>
        </div>
        <textarea
          :class="$style.textarea"
          :value="nameDataString"
          @input="validateTextarea"
          @change="updateNameData"
        />
      </div>
    </div>
    <ButtonContainer sticky>
      <ShadowButton warning @click="clearNameData">이름 초기화</ShadowButton>
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
$border-color: palette.$darker-gray;

.content-container {
  position: relative;

  display: flex;
  gap: 10px;
  flex-direction: column;

  background-color: palette.$dark-gray;

  border: solid value.$border-width $border-color;

  padding: 15px;

  width: 100%;
  max-width: 300px;
}

.option-container {
  display: flex;
  gap: value.$button-container-small-gap;
  flex-direction: column;
}

.textarea-container {
  display: flex;
  gap: 15px;

  width: 100%;
}

$line-number-height: 35px;

.textarea-line-container {
  display: flex;
  align-items: flex-end;
  flex-direction: column;

  counter-set: line-number;
}

.textarea-line {
  & {
    display: flex;
    align-items: center;

    height: $line-number-height;

    counter-increment: line-number;
  }

  // Line
  &::after {
    content: '';

    position: absolute;
    left: 0;

    width: 100%;
    height: $line-number-height;

    pointer-events: none;

    border-bottom: solid value.$border-slim-width $border-color;
  }

  // Line number
  span {
    &::before {
      content: counter(line-number);

      font-weight: bold;
    }
  }
}

.textarea {
  line-height: $line-number-height;

  resize: none;

  background-color: transparent;
  border: none;

  width: 100%;

  white-space: pre;
}
</style>
