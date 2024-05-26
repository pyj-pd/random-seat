<script setup lang="ts">
import CustomButton from '@/components/common/CustomButton.vue'
import type { SeatPosition } from '@/constants/seat'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { useSectionStore } from '@/stores/useSectionStore'
import { storeToRefs } from 'pinia'

const seatSizeStore = useSeatSizeStore()
const { setSize, setSeatData } = seatSizeStore

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
    <p>제외하고 싶은 자리를 클릭해주세요.</p>
    <p>
      총 자리 수: <b>{{ totalSeatNumber }}개</b>
    </p>
    <div :class="$style['table-vertical-wrapper']">
      <div :class="$style['table-top']">TOP</div>
      <div :class="$style['table-horizontal-wrapper']">
        <table :class="$style.table">
          <thead>
            <tr>
              <!-- Column number headers -->
              <th scope="col"></th>
              <th scope="col" v-for="column in columnSize" :key="column">{{ column }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in seatData" :key="rowIndex">
              <!-- Row content -->
              <th scope="row">{{ rowIndex }}</th>
              <td v-for="(column, columnIndex) in row" :key="`${rowIndex},${columnIndex}`">
                <button @click="() => toggleSeat([columnIndex, rowIndex])">
                  {{ column.isExcluded ? 'X' : 'O' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Add column -->
        <button @click="() => setSize(columnSize + 1, rowSize, true)">+</button>
      </div>
      <!-- Add row -->
      <button @click="() => setSize(columnSize, rowSize + 1, true)">+</button>
    </div>
    <CustomButton @click="() => setCurrentSectionId('random-pick-seat')">다음으로</CustomButton>
  </main>
</template>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.table {
  td {
    border: 1px solid red;

    > button {
      width: 100%;
      height: 100%;
    }
  }

  td,
  th {
    width: 60px;
    height: 50px;
  }
}

.table-top {
  width: 100px;
  height: 30px;

  background-color: black;
  color: white;
}

.table-vertical-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table-horizontal-wrapper {
  display: flex;
  align-items: center;
}
</style>
