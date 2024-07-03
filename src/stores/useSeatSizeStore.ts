import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_ROW_SIZE,
  DEFAULT_SEAT_ROW_DATA,
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  MIN_SEAT_COLUMN_SIZE,
  MIN_SEAT_ROW_SIZE,
  type SeatData,
  type SeatPosition,
  type SeatRowData,
} from '@/constants/seat'
import { getShuffledSeatData, getTotalNumberOfSeats, initializeSeatData } from '@/utils/seat'
import { defineStore } from 'pinia'

/**
 * Whether setting seat size was successful or not.
 * `false` when exceeded max size.
 */
type SetSeatSizeResult = {
  columnSize: boolean
  rowSize: boolean
}

type SeatLineType = 'column' | 'row'

const _assertSeatLineIndex = (type: SeatLineType, inputIndex: number, maxIndex: number): void => {
  if (!Number.isInteger(inputIndex) || inputIndex < 0 || inputIndex > maxIndex)
    throw new Error(`Index of a ${type} should be between 0 and ${maxIndex}.`)
}

const _isLineSizeInvalid = (type: SeatLineType, size: number): boolean => {
  if (type === 'column') return size > MAX_SEAT_COLUMN_SIZE || size < MIN_SEAT_COLUMN_SIZE
  else if (type === 'row') return size > MAX_SEAT_ROW_SIZE || size < MIN_SEAT_ROW_SIZE
  else return false
}

export const useSeatSizeStore = defineStore('seatSize', {
  state: () => ({
    columnSize: DEFAULT_COLUMN_SIZE,
    rowSize: DEFAULT_ROW_SIZE,
    seatData: DEFAULT_SEAT_ROW_DATA as SeatRowData,
  }),
  getters: {
    /**
     * Get data of a seat at certain position.
     * @returns A function that can be called to get the data.
     */
    getSeatData(state) {
      return ([columnPos, rowPos]: SeatPosition) => state.seatData[rowPos][columnPos]
    },
    /**
     * Total number of seats included.
     */
    totalSeatNumber(state) {
      return getTotalNumberOfSeats(state.seatData)
    },
  },
  actions: {
    /**
     * Set seat data size.
     * @param columnSize
     * @param rowSize
     * @param modify Whether to modify the original data or initialize again.
     * @returns An object that indicates whether setting seat size was successful.
     * @todo Adding row at both sides
     */
    setSize(columnSize: number, rowSize: number, modify: boolean = false): SetSeatSizeResult {
      const result: SetSeatSizeResult = {
        columnSize: true,
        rowSize: true,
      }

      if (_isLineSizeInvalid('column', columnSize)) result.columnSize = false
      else this.columnSize = columnSize

      if (_isLineSizeInvalid('row', rowSize)) result.rowSize = false
      else this.rowSize = rowSize

      this.seatData = initializeSeatData(
        this.columnSize,
        this.rowSize,
        modify ? this.seatData : undefined,
      )

      return result
    },
    /**
     * Remove certain column or row.
     * @param type Which one trying to remove: Column or row
     * @param where Index of the column/row
     * @returns An object that indicates whether removing the seat line was successful.
     */
    removeSeatLine(type: SeatLineType, where: number) {
      const result: SetSeatSizeResult = {
        columnSize: true,
        rowSize: true,
      }

      modifyingSeat: {
        if (type === 'column') {
          const columnLength = this.seatData[0].length

          if (_isLineSizeInvalid('column', columnLength - 1)) {
            result.columnSize = false
            break modifyingSeat
          }

          _assertSeatLineIndex(type, where, columnLength - 1)

          const newData = [...this.seatData].map((row) => {
            // Remove the column in every row
            const newRow = [...row]

            newRow.splice(where, 1)

            return newRow
          })

          this.seatData = newData
          this.columnSize--
        } else if (type === 'row') {
          const rowLength = this.seatData.length

          if (_isLineSizeInvalid('row', rowLength - 1)) {
            result.rowSize = false
            break modifyingSeat
          }

          _assertSeatLineIndex(type, where, rowLength - 1)

          const newData = [...this.seatData]
          newData.splice(where, 1)

          this.seatData = newData
          this.rowSize--
        }
      }

      return result
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
    /**
     * Assign random numbers to the seats.
     */
    shuffleSeats() {
      this.seatData = getShuffledSeatData(this.seatData)
    },
  },
})
