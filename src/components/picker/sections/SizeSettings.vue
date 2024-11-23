<script setup lang="ts">
import NormalButton from '@/components/common/NormalButton.vue'
import ShadowButton from '@/components/common/ShadowButton.vue'
import {
  DATA_ARE_SAVED_TEXT,
  DEFAULT_COLUMN_SIZE,
  DEFAULT_ROW_SIZE,
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  MIN_SEAT_COLUMN_SIZE,
  MIN_SEAT_NUMBER,
  TOP_INDICATOR_TEXT,
} from '@/constants/seat'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import { storeToRefs } from 'pinia'
import PersonIcon from '../icons/PersonIcon.vue'
import { onMounted, ref, watch } from 'vue'
import XIcon from '../icons/XIcon.vue'
import MouseGuide from '../MouseGuide.vue'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import SectionTitle from '../SectionTitle.vue'
import type { SeatPosition } from '@/types/seat'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import { useOptionStore } from '@/stores/useOptionStore'
import { sections, type SectionId } from '@/constants/section'

const NEXT_SECTION: SectionId = 'name-settings'

const seatDataStore = useSeatDataStore(),
  { setSize, clearSeatData, clearNameData, setSeatData, removeSeatLine } = seatDataStore,
  { columnSize, rowSize, seatData, getSeatData, totalSeatNumber } = storeToRefs(seatDataStore)

const scrollViewRef = ref<HTMLDivElement | null>(null)

const { setCurrentSectionId } = useSectionNavigation()

/**
 * Update this in order to reshow the mouse guide pop-up.
 */
const mouseGuideKey = ref<number>(0)
const showMouseGuide = ref<boolean>(false)

const reshowMouseGuide = () => mouseGuideKey.value++

/**
 * Show mouse guide only on first time.
 * This will work on `onMounted` because we need initial data of `isFirstTime`
 * before actually changing the `isFirstTime` value.
 */
const optionStore = useOptionStore(),
  { isFirstTime } = storeToRefs(optionStore)

onMounted(() => {
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
  clearSeatData({ columnSize: DEFAULT_COLUMN_SIZE, rowSize: DEFAULT_ROW_SIZE })
  clearNameData()

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
    setSize({ columnSize: columnSize.value, rowSize: rowSize.value + 1 }, true)

    rowUpdateRefresh.value ??= 0
    rowUpdateRefresh.value++

    columnUpdateRefresh.value = null
  },
  addColumn = () => {
    setSize({ columnSize: columnSize.value + 1, rowSize: rowSize.value }, true)

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
    <SectionTitle title="자리 배치를 설정해 주세요." :description="DATA_ARE_SAVED_TEXT" />
    <!-- Table scroll view -->
    <div ref="scrollViewRef" :class="$style['table-scroll-view-container']">
      <div :class="$style['table-container']">
        <!-- Table info -->
        <div :class="$style['table-info-container']">
          <div :class="$style['seat-number']">
            <span
              >자리 수: <b>{{ totalSeatNumber }}/{{ columnSize * rowSize }}석</b></span
            >
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
                <MouseGuide
                  v-if="column === MIN_SEAT_COLUMN_SIZE"
                  text="숫자를 클릭해서 해당 줄을 없앨 수 있어요."
                  :reshow-key="mouseGuideKey"
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
                <NormalButton :class="$style['line-button']" @click="addRow">+</NormalButton>
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
                  <template v-if="column.assignedNumber">{{ column.assignedNumber }}</template>
                  <PersonIcon v-else-if="!column.isExcluded" />
                  <XIcon v-else :class="$style['x-shape']" />
                </NormalButton>
                <MouseGuide
                  v-if="
                    columnIndex === MIN_SEAT_COLUMN_SIZE - 1 &&
                    rowIndex === MIN_SEAT_COLUMN_SIZE - 1
                  "
                  text="자리를 클릭해서 해당 자리를 제외할 수 있어요."
                  :reshow-key="mouseGuideKey"
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
                    :class="[$style['line-button'], $style.vertical]"
                    vertical
                    @click="addColumn"
                    >+</NormalButton
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ButtonContainer sticky>
      <ShadowButton warning @click="resetSeatData">자리 및 이름 초기화</ShadowButton>
      <ShadowButton @click="() => reshowMouseGuide()">도움말 보기</ShadowButton>

      <ShadowButton show-next-icon @click="() => setCurrentSectionId(NEXT_SECTION)"
        >{{ sections[NEXT_SECTION].title }}으로</ShadowButton
      >
    </ButtonContainer>
  </main>
</template>

<style module lang="scss">
@use '@/styles/seat' as seat;
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
