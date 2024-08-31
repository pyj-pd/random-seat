<script setup lang="ts">
import NormalButton from '@/components/common/NormalButton.vue'
import ShadowButton from '@/components/common/ShadowButton.vue'
import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_ROW_SIZE,
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  MIN_SEAT_COLUMN_SIZE,
  MIN_SEAT_NUMBER,
} from '@/constants/seat'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import PersonIcon from '../PersonIcon.vue'
import { onMounted, ref, watch } from 'vue'
import XShape from '../XShape.vue'
import MouseGuide from '../MouseGuide.vue'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import SectionTitle from '../SectionTitle.vue'
import type { SeatPosition } from '@/types/seat'

const seatSizeStore = useSeatSizeStore()
const { setSize, resetData, setSeatData, removeSeatLine } = seatSizeStore

const scrollViewRef = ref<HTMLDivElement | null>(null)

const sectionStore = useSectionStore()
const { setCurrentSectionId } = sectionStore

const { columnSize, rowSize, isFirstTime, seatData, getSeatData, totalSeatNumber } =
  storeToRefs(seatSizeStore)

/**
 * Update this in order to reshow the mouse guide pop-up.
 */
const mouseGuideKey = ref<number>(0)
const showMouseGuide = ref<boolean>(false)

const reshowMouseGuide = () => mouseGuideKey.value++

onMounted(() => {
  // Show mouse guide only on first time.
  // This will work on `onMounted` because we need initial data of `isFirstTime`
  // before actually changing the `isFirstTime` value.

  showMouseGuide.value = isFirstTime.value
  if (isFirstTime.value) reshowMouseGuide() // Show tooltip if first time

  isFirstTime.value = false
})

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

  const currentSeatData = getSeatData.value(position)
  setSeatData(position, { ...currentSeatData, isExcluded: !currentSeatData.isExcluded })
}

const resetSeatData = () => {
  resetData(DEFAULT_COLUMN_SIZE, DEFAULT_ROW_SIZE)

  rowUpdateRefresh.value = null
  columnUpdateRefresh.value = null
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

// Line add buttons
const addRow = () => {
    setSize(columnSize.value, rowSize.value + 1, true)

    rowUpdateRefresh.value ??= 0
    rowUpdateRefresh.value++

    columnUpdateRefresh.value = null
  },
  addColumn = () => {
    setSize(columnSize.value + 1, rowSize.value, true)

    rowUpdateRefresh.value = null

    columnUpdateRefresh.value ??= 0
    columnUpdateRefresh.value++
  }

// Line header buttons for removing the line
const removeRow = (index: number) => {
    removeSeatLine('row', index)

    rowUpdateRefresh.value = null
  },
  removeColumn = (index: number) => {
    removeSeatLine('column', index)

    columnUpdateRefresh.value = null
  }
</script>

<template>
  <main :class="$style.container">
    <SectionTitle title="자리 배치를 설정해 주세요." />
    <!-- Table scroll view -->
    <div :class="$style['table-scroll-view-container']" ref="scrollViewRef">
      <div :class="$style['table-container']">
        <!-- Table info -->
        <div :class="$style['table-info-container']">
          <div :class="$style['seat-number']">
            <span
              >자리 수: <b>{{ totalSeatNumber }}/{{ columnSize * rowSize }}석</b></span
            >
          </div>

          <div :class="$style['table-top']">
            <span>상단</span>
          </div>
        </div>
        <!-- Table content -->
        <table :class="$style.table">
          <tr>
            <!-- For spacing -->
            <th scope="col" :class="$style['no-style']"></th>

            <!-- Column number headers -->
            <th scope="col" v-for="column in columnSize" :key="column">
              <NormalButton
                @click="() => removeColumn(column - 1)"
                :class="$style['header-button']"
                :animation="false"
              >
                {{ column }}
              </NormalButton>
              <MouseGuide
                v-if="column === MIN_SEAT_COLUMN_SIZE"
                text="숫자를 클릭해서 해당 줄을 없앨 수 있어요."
                :reshowKey="mouseGuideKey"
                :immediate="showMouseGuide"
              />
            </th>
          </tr>
          <tr>
            <!-- For spacing -->
            <td :class="$style['no-style']"></td>

            <!-- Row add button -->
            <td
              v-if="rowSize < MAX_SEAT_ROW_SIZE"
              :colspan="columnSize"
              :class="$style['line-button-container']"
            >
              <NormalButton @click="addRow" :class="$style['line-button']">+</NormalButton>
            </td>
          </tr>
          <!-- Row content -->
          <tr v-for="(row, rowIndex) in seatData" :key="rowIndex">
            <!-- Row number headers -->
            <th scope="row">
              <NormalButton
                @click="() => removeRow(rowIndex)"
                :class="$style['header-button']"
                :animation="false"
              >
                {{ rowIndex + 1 }}
              </NormalButton>
            </th>

            <!-- Seat button -->
            <td v-for="(column, columnIndex) in row" :key="`${rowIndex},${columnIndex}`">
              <NormalButton
                @click="() => toggleSeat([columnIndex, rowIndex], column.isExcluded)"
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
                :key="rowUpdateRefresh ?? columnUpdateRefresh ?? 0"
                :animation="false"
              >
                <template v-if="column.assignedNumber">{{ column.assignedNumber }}</template>
                <PersonIcon v-else-if="!column.isExcluded" />
                <XShape v-else :class="$style['x-shape']" />
              </NormalButton>
              <MouseGuide
                v-if="
                  columnIndex === MIN_SEAT_COLUMN_SIZE - 1 && rowIndex === MIN_SEAT_COLUMN_SIZE - 1
                "
                text="자리를 클릭해서 해당 자리를 제외할 수 있어요."
                :reshowKey="mouseGuideKey"
                :immediate="showMouseGuide"
              />
            </td>

            <!-- Column add button on first row and make it full height -->
            <td
              v-if="rowIndex === 0 && columnSize < MAX_SEAT_COLUMN_SIZE"
              rowspan="0"
              :class="[$style['line-button-container'], $style.vertical]"
            >
              <div>
                <NormalButton
                  @click="addColumn"
                  :class="[$style['line-button'], $style.vertical]"
                  vertical
                  >+</NormalButton
                >
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <ButtonContainer sticky>
      <ShadowButton @click="resetSeatData" warning>초기화</ShadowButton>
      <ShadowButton @click="() => reshowMouseGuide()">도움말 보기</ShadowButton>

      <ShadowButton @click="() => setCurrentSectionId('name-settings')">다음으로</ShadowButton>
    </ButtonContainer>
  </main>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: value.$container-gap;

  width: 100%;
  min-height: 700px;
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

// Table scroll view
.table-scroll-view-container {
  display: flex;

  width: fit-content;
  max-width: 100%;

  overflow-x: auto;
}

// Table content
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;

  white-space: nowrap;

  padding: 10px 15px;
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

  width: 100%;
  height: 100%;

  padding: 22px;

  background-color: palette.$gray;
  color: palette.$blackish;
  border: solid value.$border-slim-width palette.$dark-gray;

  font-variant: proportional-nums;

  cursor: pointer;

  transition: 0.08s value.$animation-ease;
  transition-property: transform;

  &.new {
    animation: seat-initial-animation 0.5s value.$ease-in-out both;
  }

  &.excluded {
    transform: scale(0.9);
    filter: grayscale(1);

    background-color: palette.$white;
    border-color: palette.$gray;
  }

  .table tr:nth-child(even) &:not(.excluded) {
    background-color: palette.$dark-gray;
  }
}

.seat-button > svg {
  $person-icon-size: 11px;

  width: $person-icon-size;

  &.x-shape {
    $x-shape-size: 7px;

    width: $x-shape-size;
    height: $x-shape-size;
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

  .line-button {
    display: block;

    padding: 0;

    width: 100%;
    height: $line-button-size;

    &.vertical {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
