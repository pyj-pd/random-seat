<script setup lang="ts">
import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_ROW_SIZE,
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  MIN_SEAT_COLUMN_SIZE,
  MIN_SEAT_NUMBER,
  TOP_INDICATOR_TEXT,
} from '@/constants/seat'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import type { SeatPosition } from '@/types/seat'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import MouseGuide from './MouseGuide.vue'
import NormalButton from '@/components/common/NormalButton.vue'
import { Plus, UserRound, X } from 'lucide-vue-next'
import SeatSizeTip from './SeatSizeTip.vue'

const scrollViewRef = ref<HTMLDivElement | null>(null)

const seatDataStore = useSeatDataStore(),
  { setSize, clearSeatData, getSeatData, setSeatData, removeSeatLine } = seatDataStore,
  { columnSize, rowSize, seatData, totalSeatNumber } = storeToRefs(seatDataStore)

// Transition every time a row/column is added
const rowUpdateRefresh = ref<number | null>(null),
  columnUpdateRefresh = ref<number | null>(null)

/**
 * Exclude or include a seat at certain position based on current state.
 * @param position Position of the seat
 * @param isExcluded Whether the seat is excluded or not
 */
const toggleSeat = (position: SeatPosition, isExcluded: boolean) => {
  if (totalSeatNumber.value <= MIN_SEAT_NUMBER && !isExcluded) return // Seat number reached minimum

  const currentSeatData = getSeatData(position)
  if (currentSeatData)
    setSeatData(position, { ...currentSeatData, isExcluded: !currentSeatData.isExcluded })
}

const resetSeatData = () => {
  clearSeatData({ columnSize: DEFAULT_COLUMN_SIZE, rowSize: DEFAULT_ROW_SIZE })

  rowUpdateRefresh.value = null
  columnUpdateRefresh.value = null
}

// Line add buttons
const addRow = () => {
  setSize({ columnSize: columnSize.value, rowSize: rowSize.value + 1 }, true)

  rowUpdateRefresh.value ??= 0
  rowUpdateRefresh.value++

  columnUpdateRefresh.value = null
}

const addColumn = () => {
  setSize({ columnSize: columnSize.value + 1, rowSize: rowSize.value }, true)

  rowUpdateRefresh.value = null

  columnUpdateRefresh.value ??= 0
  columnUpdateRefresh.value++
}

// Line header buttons for removing the line
const removeRow = (index: number) => {
  removeSeatLine('row', index)

  rowUpdateRefresh.value = null
}

const removeColumn = (index: number) => {
  removeSeatLine('column', index)

  columnUpdateRefresh.value = null
}

// Mouse guide

/**
 * Update this in order to reshow the mouse guide pop-up.
 */
const mouseGuideKey = ref<number>(0)

const showMouseGuide = () => {
  mouseGuideKey.value++
}

/**
 * Scroll to edge of scroll view for better UX.
 * Users won't have to scroll every time they add a column. That's painful af.
 */
watch(
  [columnSize],
  () => {
    if (scrollViewRef.value === null) return

    const width = scrollViewRef.value.scrollWidth

    scrollViewRef.value.scrollTo({
      left: width,
    })
  },
  { flush: 'post' },
)

defineExpose({
  resetSeatData,
  showMouseGuide,
})
</script>

<template>
  <section :class="$style.container">
    <SeatSizeTip />
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
                <NormalButton
                  :class="$style['header-button']"
                  :animation="false"
                  @click="() => removeColumn(column - 1)"
                >
                  {{ column }}
                </NormalButton>
                <MouseGuide v-if="column === MIN_SEAT_COLUMN_SIZE" :reshow-key="mouseGuideKey">
                  숫자를 클릭해서 <b>해당 줄을 삭제</b>할 수 있어요.
                </MouseGuide>
              </th>
            </tr>
            <tr>
              <!-- For spacing -->
              <td :class="$style['no-style']"></td>
              <!-- Row add button -->
              <td
                :colspan="columnSize"
                :class="[
                  $style['line-button-container'],
                  { [$style.hidden]: rowSize >= MAX_SEAT_ROW_SIZE },
                ]"
              >
                <NormalButton :class="$style['line-button']" @click="addRow">
                  <Plus />
                </NormalButton>
              </td>
            </tr>
            <!-- Row content -->
            <tr v-for="(row, rowIndex) in seatData" :key="rowIndex">
              <!-- Row number headers -->
              <th scope="row">
                <NormalButton
                  :class="$style['header-button']"
                  :animation="false"
                  @click="() => removeRow(rowIndex)"
                >
                  {{ rowIndex + 1 }}
                </NormalButton>
              </th>
              <!-- Seat button -->
              <td v-for="(column, columnIndex) in row" :key="`${rowIndex},${columnIndex}`">
                <NormalButton
                  :key="rowUpdateRefresh ?? columnUpdateRefresh ?? 0"
                  :class="[
                    $style['seat-button'],
                    {
                      [$style.new]:
                        (rowIndex === 0 && rowUpdateRefresh !== null) ||
                        (columnIndex === columnSize - 1 && columnUpdateRefresh !== null),
                    },
                    {
                      [$style.excluded]: column.isExcluded,
                    },
                  ]"
                  :animation="false"
                  @click="
                    () =>
                      toggleSeat({ columnPos: columnIndex, rowPos: rowIndex }, column.isExcluded)
                  "
                >
                  <X v-if="column.isExcluded" />
                  <template v-else-if="column.assignedNumber">{{ column.assignedNumber }}</template>
                  <UserRound v-else />
                </NormalButton>
                <MouseGuide
                  v-if="
                    columnIndex === MIN_SEAT_COLUMN_SIZE - 1 &&
                    rowIndex === MIN_SEAT_COLUMN_SIZE - 1
                  "
                  :reshow-key="mouseGuideKey"
                >
                  자리를 클릭해서 <b>해당 자리를 제외</b>할 수 있어요.
                </MouseGuide>
              </td>
              <!-- Column add button on first row and make it full height -->
              <td
                v-if="rowIndex === 0"
                rowspan="0"
                :class="[
                  $style['line-button-container'],
                  $style.vertical,
                  { [$style.hidden]: columnSize >= MAX_SEAT_COLUMN_SIZE },
                ]"
              >
                <div>
                  <NormalButton
                    :class="[$style['line-button'], $style.vertical]"
                    vertical
                    @click="addColumn"
                  >
                    <Plus />
                  </NormalButton>
                </div>
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

    width: 70px;
    height: 50px;
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

  width: 70px;
  height: 50px;

  padding: 22px;

  background-color: palette.$gray;
  color: seat.$text-color;
  border: solid seat.$border-width palette.$dark-gray;

  font-variant: proportional-nums;

  cursor: pointer;

  transition: 0.08s value.$animation-ease;
  transition-property: transform;

  &.new {
    animation: seat-initial-animation 0.5s value.$ease-in-out both;
  }

  &.excluded {
    transform: scale(seat.$excluded-scale);
    background-color: seat.$excluded-background-color;
    border-color: seat.$excluded-border-color;
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
    width: 16px;
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

// Line header buttons
.header-button {
  border: none;

  width: 60px;
  height: 40px;

  text-decoration: underline;

  &:hover {
    background-color: palette.$red;
    color: palette.$gray;
  }
}

// Line modifier button
$line-button-size: 30px;

// <td>
.line-button-container {
  position: relative;

  &.hidden {
    visibility: hidden;
  }

  &.vertical {
    width: $line-button-size;
    height: unset;

    > div {
      // Extra div is needed for vertically-full column because of the suckness of CSS
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;
    }
  }

  &:not(.vertical) {
    height: $line-button-size;
  }
}

.line-button {
  display: block;

  padding: 0;

  width: 100%;
  height: $line-button-size;

  &.vertical {
    width: 100%;
    height: 100%;
  }

  svg {
    width: 1em;
  }
}
</style>
