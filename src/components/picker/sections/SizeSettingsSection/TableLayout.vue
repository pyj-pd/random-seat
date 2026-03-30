<script setup lang="ts">
import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_ROW_SIZE,
  MIN_SEAT_NUMBER,
  TOP_INDICATOR_TEXT,
} from '@/constants/seat'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import type { SeatPosition } from '@/types/seat'
import { storeToRefs } from 'pinia'
import { ref, useTemplateRef, watch } from 'vue'
import NormalButton from '@/components/common/NormalButton.vue'
import { UserRound, X } from 'lucide-vue-next'
import SeatSizeTip from './SeatSizeTip.vue'

const props = defineProps<{
  isSettingFixedSeats?: boolean
}>()

const scrollViewRef = ref<HTMLDivElement | null>(null)

const seatDataStore = useSeatDataStore(),
  { clearSeatData, getSeatData, setSeatData } = seatDataStore,
  { columnSize, rowSize, seatData, nameData, totalSeatNumber, assignableSeatNumbers } =
    storeToRefs(seatDataStore)

const handleSeatButtonClick = (seatPosition: SeatPosition) => {
  const currentSeatData = getSeatData(seatPosition)
  if (!currentSeatData) return

  if (props.isSettingFixedSeats) {
    askFixedSeat(seatPosition)
  } else {
    // Toggle seat exclusion
    if (totalSeatNumber.value <= MIN_SEAT_NUMBER && !currentSeatData.isExcluded) return // Seat number reached minimum. Can't exclude more seats.

    setSeatData(seatPosition, {
      ...currentSeatData,
      assignedNumber: null,
      isExcluded: !currentSeatData.isExcluded,
      isFixed: false,
    })
  }
}

// Handle fixed seat settings
const fixedSeatSelectElementRef = useTemplateRef<HTMLSelectElement>('fixed-seat-select-element')

const currentSelectedSeatPosition = ref<SeatPosition | null>(null)
const askFixedSeat = (seatPosition: SeatPosition) => {
  if (!fixedSeatSelectElementRef.value) return

  currentSelectedSeatPosition.value = seatPosition
  fixedSeatSelectElementRef.value.showPicker()
}

const handleFixedSeatInput = (event: InputEvent) => {
  const element = event.target as HTMLSelectElement

  const selectedSeatNumber = Number(element.value)
  if (isNaN(selectedSeatNumber)) return

  setSeatData(currentSelectedSeatPosition.value!, {
    assignedNumber: selectedSeatNumber,
    isFixed: true,
  })

  element.value = '' // Reset select element to allow same option selection
}

const resetSeatData = () => {
  clearSeatData({ columnSize: DEFAULT_COLUMN_SIZE, rowSize: DEFAULT_ROW_SIZE })
}

/**
 * Scroll to edge of scroll view whenever column size changes for better UX
 */
watch(
  [columnSize],
  () => {
    if (scrollViewRef.value === null) return

    const width = scrollViewRef.value.scrollWidth

    scrollViewRef.value.scrollTo({
      left: width,
      behavior: 'smooth',
    })
  },
  { flush: 'post' },
)

const getOptionTextForSeatNumber = (seatNumber: number): string => {
  let textContent = `${seatNumber}번`

  const currentName: string | undefined = nameData.value[seatNumber]
  if (currentName) textContent += ` (${currentName})`

  return textContent
}

defineExpose({
  resetSeatData,
})
</script>

<template>
  <section :class="$style.container">
    <SeatSizeTip :mode="props.isSettingFixedSeats ? 'fix' : 'exclude'" />
    <!-- Virtual select element for fixed seat settings -->
    <select
      ref="fixed-seat-select-element"
      :class="$style['fixed-seat-select-element']"
      @input="handleFixedSeatInput"
    >
      <option v-for="seatNumber of assignableSeatNumbers" :key="seatNumber" :value="seatNumber">
        {{ getOptionTextForSeatNumber(seatNumber) }}
      </option>
    </select>
    <!-- Table scroll view -->
    <div ref="scrollViewRef" :class="$style['table-scroll-view-container']">
      <div :class="$style['table-container']">
        <!-- Table info -->
        <div :class="$style['table-info-container']">
          <div :class="$style['seat-number']">
            <span
              >자리 수: <b>{{ totalSeatNumber }}/{{ columnSize * rowSize }}석</b>
            </span>
          </div>
          <div :class="$style['table-top']">
            <span>{{ TOP_INDICATOR_TEXT }}</span>
          </div>
        </div>
        <!-- Table content -->
        <table :class="$style.table">
          <tbody>
            <tr>
              <!-- For spacing -->
              <th scope="col" :class="$style['no-style']"></th>
              <!-- Column number headers -->
              <th v-for="column in columnSize" :key="column" scope="col">
                {{ column }}
              </th>
            </tr>
            <!-- Row content -->
            <tr v-for="(row, rowIndex) in seatData" :key="rowIndex">
              <!-- Row number headers -->
              <th scope="row">
                {{ rowIndex + 1 }}
              </th>
              <!-- Seat button -->
              <td v-for="(column, columnIndex) in row" :key="`${rowIndex},${columnIndex}`">
                <NormalButton
                  :class="[
                    $style['seat-button'],
                    {
                      [$style.excluded]: column.isExcluded,
                    },
                    {
                      [$style.fixed]: column.isFixed,
                    },
                  ]"
                  :animation="false"
                  @click="() => handleSeatButtonClick({ columnPos: columnIndex, rowPos: rowIndex })"
                >
                  <X v-if="column.isExcluded" />
                  <template v-else-if="column.assignedNumber">{{ column.assignedNumber }}</template>
                  <UserRound v-else />
                </NormalButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
@use '@/styles/seat' as seat;
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  display: flex;
  gap: value.$button-container-gap;
  flex-direction: column;
  align-items: center;

  width: 100%;
}

// Select element
.fixed-seat-select-element {
  position: absolute;

  visibility: hidden;
}

// Table scroll view
.table-scroll-view-container {
  display: flex;

  width: fit-content;
  max-width: 100%;

  overflow-x: auto;
}

// Table info
.table-info-container {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.seat-number {
  position: absolute;
  left: 0;

  display: block;

  b {
    font-weight: bold;
  }
}

$table-width: 880px;

// Table content
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;

  white-space: nowrap;

  padding: value.$mini-section-padding;
  border: solid value.$border-width palette.$black;

  min-width: 600px;
}

.table-top {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;

  width: 150px;
  height: 30px;

  font-weight: bold;

  &::before,
  &::after {
    content: '';

    width: 100%;
    height: value.$border-width;

    background-color: currentColor;
  }

  > span {
    white-space: nowrap;
  }
}

.table {
  & {
    border-spacing: seat.$small-gap;

    touch-action: manipulation;
  }

  td,
  th {
    position: relative;

    width: 85px;
    height: 60px;
  }

  td.no-style,
  th.no-style {
    width: unset;
    height: unset;
  }
}

// Seat button
.seat-button {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  font-size: seat.$font-size;

  background-color: palette.$gray;
  color: seat.$text-color;
  border: solid seat.$border-width palette.$dark-gray;

  font-variant: proportional-nums;

  cursor: pointer;

  transition: 0.08s value.$animation-ease;
  transition-property: transform;

  &.excluded {
    filter: grayscale(100%);

    transform: scale(seat.$excluded-scale);
  }

  &.fixed {
    border-color: palette.$green;
  }

  .table tr:nth-child(even) &:not(.excluded) {
    background-color: palette.$dark-gray;
  }

  // Animation
  &:not(.excluded) {
    &:hover {
      transform: scale(seat.$seat-button-hover-scale);
    }

    &:active {
      transform: scale(seat.$seat-button-active-scale);
    }
  }

  // Icon
  > svg {
    width: 1em;
  }
}

@keyframes seat-initial-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
