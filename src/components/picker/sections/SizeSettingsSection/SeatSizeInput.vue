<script setup lang="ts">
import NumberInput from '@/components/common/NumberInput.vue'
import {
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  MIN_SEAT_COLUMN_SIZE,
  MIN_SEAT_ROW_SIZE,
} from '@/constants/seat'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const NUMBER_INPUT_STEP = 1

const seatDataStore = useSeatDataStore()
const { rowSize, columnSize } = storeToRefs(seatDataStore)
const { setSize } = seatDataStore

const columnSizeInput = computed<number>({
  get: () => columnSize.value,
  set: (value: number) => {
    setSize({ rowSize: rowSize.value, columnSize: value }, true)
  },
})

const rowSizeInput = computed<number>({
  get: () => rowSize.value,
  set: (value: number) => {
    setSize({ rowSize: value, columnSize: columnSize.value }, true)
  },
})
</script>

<template>
  <section :class="$style.container">
    <ul :class="$style['input-list-container']">
      <li>
        <NumberInput
          v-model="columnSizeInput"
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
          v-model="rowSizeInput"
          label="세로(행)"
          type="number"
          :min="MIN_SEAT_ROW_SIZE"
          :max="MAX_SEAT_ROW_SIZE"
          :step="NUMBER_INPUT_STEP"
          show-buttons
        />
      </li>
    </ul>
  </section>
</template>

<style lang="scss" module>
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;

.container {
  display: flex;

  padding: value.$mini-section-padding;
  border: solid value.$border-width palette.$black;

  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 1.1rem;
}

.input-list-container {
  display: flex;
  gap: value.$button-container-gap;

  width: 100%;

  list-style: none;
  padding: 0;

  > li {
    width: 100%;
  }
}
</style>
