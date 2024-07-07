<script setup lang="ts">
import NormalButton from '@/components/common/NormalButton.vue'
import CustomButton from '@/components/common/ShadowButton.vue'
import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_ROW_SIZE,
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  type SeatPosition,
} from '@/constants/seat'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'
import PersonIcon from '../PersonIcon.vue'
import { ref } from 'vue'
import XShape from '../XShape.vue'

const seatSizeStore = useSeatSizeStore()
const { setSize, setSeatData, removeSeatLine } = seatSizeStore

const { setCurrentSectionId } = useSectionStore()

const { columnSize, rowSize, seatData, getSeatData, totalSeatNumber } = storeToRefs(seatSizeStore)

// Transition every time a row/column is added
const rowUpdateRefresh = ref<number | null>(null),
  columnUpdateRefresh = ref<number | null>(null)

/**
 * Exclude or include a seat at certain position based on current state.
 * @param position Position of the seat
 */
const toggleSeat = (position: SeatPosition) => {
  const currentSeatData = getSeatData.value(position)
  setSeatData(position, { ...currentSeatData, isExcluded: !currentSeatData.isExcluded })
}

const resetSeatData = () => setSize(DEFAULT_COLUMN_SIZE, DEFAULT_ROW_SIZE, false)

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
    <div :class="$style.title">
      <h2>제외하고 싶은 자리를 클릭해주세요.</h2>
      <p>
        자리를 눌러 해당 자리를 제외할 수 있으며<br />행과 열 숫자를 클릭해 해당 줄을 삭제할 수
        있습니다.
      </p>
    </div>
    <!-- Table scroll view -->
    <div :class="$style['table-scroll-view-container']">
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
                @click="() => toggleSeat([columnIndex, rowIndex])"
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
    <div :class="$style['action-button-container']">
      <CustomButton @click="resetSeatData" warning>초기화</CustomButton>
      <CustomButton @click="() => setCurrentSectionId('random-pick-seat')">다음으로</CustomButton>
    </div>
  </main>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  width: 100%;
  min-height: 700px;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;

  width: 100%;
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

  width: 100%;
  max-width: $table-width;

  overflow-x: auto;
}

// Table content
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;

  width: $table-width;

  padding: 10px 15px;
  border: solid value.$border-width palette.$black;
}

.table-top {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 30px;

  font-weight: bold;

  background-color: palette.$black;
  color: white;
}

.table {
  td,
  th {
    width: 60px;
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

  cursor: pointer;

  transition: value.$animation-duration value.$animation-ease;
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

// Action buttons
.action-button-container {
  display: flex;
  gap: value.$button-container-gap;
}
</style>
