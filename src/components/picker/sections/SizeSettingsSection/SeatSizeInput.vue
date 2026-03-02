<script setup lang="ts">
import NormalButton from '@/components/common/NormalButton.vue'
import NumberInput from '@/components/common/NumberInput.vue'
import {
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  MIN_SEAT_COLUMN_SIZE,
  MIN_SEAT_ROW_SIZE,
} from '@/constants/seat'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const NUMBER_INPUT_STEP = 1

const seatDataStore = useSeatDataStore()
const { rowSize, columnSize } = storeToRefs(seatDataStore)
const { setSize } = seatDataStore

const seatSizeInput = ref({
  rowSize: rowSize.value,
  columnSize: columnSize.value,
})

watch([rowSize, columnSize], ([newRowSize, newColumnSize]) => {
  seatSizeInput.value = {
    rowSize: newRowSize,
    columnSize: newColumnSize,
  }
})

const submitSeatSize = () => {
  setSize({
    columnSize: Number(seatSizeInput.value.columnSize),
    rowSize: Number(seatSizeInput.value.rowSize),
  })
}
</script>

<template>
  <section :class="$style.container">
    <h2 :class="$style.title">자리 크기 설정</h2>
    <form :class="$style['form-container']" @submit.prevent="submitSeatSize">
      <ul :class="$style['input-list-container']">
        <li>
          <NumberInput
            v-model="seatSizeInput.columnSize"
            label="가로(열)"
            type="number"
            :min="MIN_SEAT_COLUMN_SIZE"
            :max="MAX_SEAT_COLUMN_SIZE"
            :step="NUMBER_INPUT_STEP"
            show-buttons
          />
        </li>
        <li>
          <NumberInput
            v-model="seatSizeInput.rowSize"
            label="세로(행)"
            type="number"
            :min="MIN_SEAT_ROW_SIZE"
            :max="MAX_SEAT_ROW_SIZE"
            :step="NUMBER_INPUT_STEP"
            show-buttons
          />
        </li>
      </ul>
      <NormalButton type="submit">적용</NormalButton>
    </form>
  </section>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

.container {
  display: flex;
  align-items: flex-start;
  gap: value.$button-container-gap;
  flex-direction: column;

  padding: value.$mini-section-padding;
  border: solid value.$border-width palette.$black;

  width: 100%;
  max-width: 250px;
}

.title {
  font-size: 1.1rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: value.$button-container-gap;

  width: 100%;

  input {
    text-align: center;
  }
}

.input-list-container {
  display: flex;
  gap: value.$button-container-small-gap;
  flex-direction: column;

  width: 100%;
}
</style>
