<script setup lang="ts">
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import SectionTitle from '@/components/picker/SectionTitle.vue'
import { storeToRefs } from 'pinia'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import ShadowButton from '@/components/common/ShadowButton.vue'
import { DATA_ARE_SAVED_TEXT } from '@/constants/seat'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import { computed, ref, watch } from 'vue'
import { NEXT_SECTION_TEXT, type SectionId } from '@/constants/section'
import { ArrowRight, Trash2 } from 'lucide-vue-next'

const NEXT_SECTION: SectionId = 'random-pick-seat'

const seatDataStore = useSeatDataStore(),
  { setNameData, clearNameData } = seatDataStore,
  { totalSeatNumber, nameDataString } = storeToRefs(seatDataStore)

const nameDataStringInput = ref(nameDataString.value)
const isInputEmpty = computed(() => nameDataStringInput.value.trim().length < 1)

const { setCurrentSectionId } = useSectionNavigation()

const updateNameData = () => {
  setNameData(nameDataStringInput.value)
}

watch(nameDataString, (newValue) => {
  nameDataStringInput.value = newValue
})

const moveToNextSection = () => {
  updateNameData()
  setCurrentSectionId(NEXT_SECTION)
}
</script>

<template>
  <main :class="$style.container">
    <SectionTitle
      title="이름을 입력해 주세요."
      :description="`모든 번호에 이름이 대응되지 않아도 됩니다.\n${DATA_ARE_SAVED_TEXT}`"
    />
    <section :class="$style['content-container']">
      <div :class="$style['textarea-container']">
        <div :class="$style['textarea-line-container']">
          <div v-for="i in totalSeatNumber" :key="i" :class="$style['textarea-line']">
            <span></span>
          </div>
        </div>
        <textarea
          ref="textareaRef"
          v-model="nameDataStringInput"
          :class="$style.textarea"
          @blur="updateNameData"
        />
      </div>
    </section>
    <ButtonContainer sticky>
      <ShadowButton warning @click="clearNameData"><Trash2 />이름 초기화</ShadowButton>
      <ShadowButton @click="moveToNextSection">
        {{ isInputEmpty ? '건너뛰기' : NEXT_SECTION_TEXT }}
        <ArrowRight />
      </ShadowButton>
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
