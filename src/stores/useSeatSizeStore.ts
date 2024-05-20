import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_ROW_SIZE,
  DEFAULT_SEAT_DATA,
  type SeatData,
  type SeatPosition,
  type SeatRowData,
} from '@/constants/seat'
import { initializeSeatData } from '@/utils/array'
import { defineStore } from 'pinia'

export const useSeatSizeStore = defineStore('seatSize', {
  state: () => ({
    columnSize: DEFAULT_COLUMN_SIZE,
    rowSize: DEFAULT_ROW_SIZE,
    seatData: DEFAULT_SEAT_DATA as SeatRowData,
  }),
  getters: {
    /**
     * Get data of a seat at certain position.
     * @returns A function that can be called to get the data.
     */
    getSeatData(state) {
      return ([columnPos, rowPos]: SeatPosition) => state.seatData[rowPos][columnPos]
    },
  },
  actions: {
    /**
     * Set seat data size.
     * @param columnSize
     * @param rowSize
     * @param modify Whether to modify the original data or initialize again.
     * @todo Adding row at both sides
     * @todo Deleting a row
     */
    setSize(columnSize: number, rowSize: number, modify: boolean = false) {
      this.columnSize = columnSize
      this.rowSize = rowSize
      this.seatData = initializeSeatData(columnSize, rowSize, modify ? this.seatData : undefined)
    },
    /**
     * Set data of a seat at certain position.
     * @param seatPos
     * @param seatPos.columnPos
     * @param seatPos.rowPos
     * @param data Data of the seat to modify into.
     */
    setSeatData([columnPos, rowPos]: SeatPosition, data: SeatData) {
      this.seatData[rowPos][columnPos] = data
    },
  },
})
