<script setup lang="ts">
import NormalButton from '@/components/common/NormalButton.vue'
import CustomButton from '@/components/common/ShadowButton.vue'
import type { SeatPosition } from '@/constants/seat'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'

const seatSizeStore = useSeatSizeStore()
const { setSize, setSeatData, removeSeatLine } = seatSizeStore

const { setCurrentSectionId } = useSectionStore()

const { columnSize, rowSize, seatData, getSeatData, totalSeatNumber } = storeToRefs(seatSizeStore)

/**
 * Exclude or include a seat at certain position based on current state.
 * @param position Position of the seat
 */
const toggleSeat = (position: SeatPosition) => {
  const currentSeatData = getSeatData.value(position)
  setSeatData(position, { ...currentSeatData, isExcluded: !currentSeatData.isExcluded })
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
            <th
              scope="col"
              v-for="column in columnSize"
              :key="column"
              @click="() => removeSeatLine('column', column - 1)"
            >
              {{ column }}
            </th>
          </tr>
          <tr>
            <!-- For spacing -->
            <td :class="$style['no-style']"></td>

            <!-- Row add button -->
            <td :colspan="columnSize" :class="$style['line-button-container']">
              <NormalButton
                @click="() => setSize(columnSize, rowSize + 1, true)"
                :class="$style['line-button']"
                :animation="false"
                >+</NormalButton
              >
            </td>
          </tr>
          <tr v-for="(row, rowIndex) in seatData" :key="rowIndex">
            <!-- Row content -->
            <th scope="row" @click="() => removeSeatLine('row', rowIndex)">
              {{ rowIndex + 1 }}
            </th>

            <!-- Seat button -->
            <td v-for="(column, columnIndex) in row" :key="`${rowIndex},${columnIndex}`">
              <NormalButton
                @click="() => toggleSeat([columnIndex, rowIndex])"
                :class="$style['seat-button']"
                :animation="false"
              >
                {{ column.isExcluded ? 'X' : 'O' }}
              </NormalButton>
            </td>

            <!-- Column add button -->
            <td
              v-if="rowIndex === 0"
              rowspan="0"
              :class="[$style['line-button-container'], $style.vertical]"
            >
              <div>
                <NormalButton
                  @click="() => setSize(columnSize + 1, rowSize, true)"
                  :class="[$style['line-button'], $style.vertical]"
                  :animation="false"
                  >+</NormalButton
                >
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <CustomButton @click="() => setCurrentSectionId('random-pick-seat')">다음으로</CustomButton>
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

  min-width: 500px;

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

  background-color: black;
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

.seat-button {
  width: 100%;
  height: 100%;

  background-color: palette.$gray;
  border: solid value.$border-slim-width palette.$dark-gray;

  cursor: pointer;
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
