import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_NAME_DATA,
  DEFAULT_ROW_SIZE,
  DEFAULT_SEAT_ROW_DATA,
  MAX_NAME_LENGTH,
  MAX_SEAT_COLUMN_SIZE,
  MAX_SEAT_ROW_SIZE,
  MIN_SEAT_COLUMN_SIZE,
  MIN_SEAT_ROW_SIZE,
  NAME_LINE_BREAK,
  SEAT_DATA_LOCAL_STORAGE_KEY,
} from '@/constants/seat'
import {
  type SeatData,
  type SeatNameData,
  type SeatPosition,
  type SeatRowData,
  type SeatSize,
} from '@/types/seat'
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
    /** Internal! Do not modify directly. */
    columnSize: DEFAULT_COLUMN_SIZE,
    /** Internal! Do not modify directly. */
    rowSize: DEFAULT_ROW_SIZE,

    nameData: { ...DEFAULT_NAME_DATA } as SeatNameData,
    seatData: [...DEFAULT_SEAT_ROW_DATA] as SeatRowData,

    /**
     * Whether user used the website first time.
     * Used for showing tooltip guides.
     */
    isFirstTime: true,
  }),
  getters: {
    /**
     * Get data of a seat at certain position.
     * @returns A function that can be called to get the data.
     */
    getSeatData(state) {
      return ({ columnPos, rowPos }: SeatPosition) => state.seatData[rowPos][columnPos]
    },
    /**
     * Total number of seats included.
     */
    totalSeatNumber(state): number {
      return getTotalNumberOfSeats(state.seatData)
    },
    /**
     * Name data into string which contains line break.
     */
    nameDataString(state): string {
      const data: string[] = [...Array(this.totalSeatNumber)].fill('')

      for (const seatNumber in this.nameData) {
        const seatIndex = Number(seatNumber) - 1

        data[seatIndex] = state.nameData[seatNumber]
      }

      return data.join(NAME_LINE_BREAK)
    },
  },
  actions: {
    /**
     * Set seat data size.
     * @param seatSize
     * @param seatSize.columnSize
     * @param seatSize.rowSize
     * @param modify Whether to modify the original data or initialize again. Default value is `false`.
     * @returns An object that indicates whether setting seat size was successful.
     */
    setSize({ columnSize, rowSize }: SeatSize, modify: boolean = false): SetSeatSizeResult {
      const result: SetSeatSizeResult = {
        columnSize: true,
        rowSize: true,
      }

      if (_isLineSizeInvalid('column', columnSize)) result.columnSize = false
      else this.columnSize = columnSize

      if (_isLineSizeInvalid('row', rowSize)) result.rowSize = false
      else this.rowSize = rowSize

      this.seatData = initializeSeatData(
        { columnSize: this.columnSize, rowSize: this.rowSize },
        modify ? this.seatData : undefined,
      )

      return result
    },
    /**
     * Reset seat data.
     * @param seatSize Set to `null` to use current size.
     * @param columnSize Column size to reset to. If not provided, it will use current column size.
     * @param rowSize Row size to reset to. If not provided, it will use current row size.
     * @param preserveExcludedState Whether to preserve excluded state of the seats. Default value is `false`.
     */
    clearSeatData(seatSize: SeatSize | null, preserveExcludedState = false) {
      const columnSize = seatSize?.columnSize ?? this.columnSize,
        rowSize = seatSize?.rowSize ?? this.rowSize

      // Set size first
      this.setSize({ columnSize, rowSize }, true)

      // Reset seat data
      this.seatData = this.seatData.map((row) =>
        row.map(
          (seat) =>
            preserveExcludedState
              ? { ...seat, assignedNumber: null } // Only remove assigned number to preserve other states
              : { isExcluded: false, assignedNumber: null }, // Reset all data
        ),
      )
    },
    clearNameData() {
      this.nameData = { ...DEFAULT_NAME_DATA }
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
    setSeatData({ columnPos, rowPos }: SeatPosition, data: SeatData) {
      this.seatData[rowPos][columnPos] = data
    },
    /**
     * Assign random numbers to the seats.
     */
    shuffleSeats() {
      this.seatData = getShuffledSeatData(this.seatData)
    },
    /**
     * Set name data from plain string.
     * @param data Pure string including line breaks.
     */
    setNameData(data: string) {
      // Trim lines
      const lines = data.split(NAME_LINE_BREAK)
      lines.splice(this.totalSeatNumber)

      const trimmedLines = lines.map((value) => value.trim().slice(0, MAX_NAME_LENGTH))

      // Name data
      const newNameData = trimmedLines.reduce<SeatNameData>((prev, curr, index) => {
        if (curr.length < 1) {
          // If empty, don't add to name data
          return prev
        }
        // Add current name to data
        else
          return {
            ...prev,
            [index + 1]: curr,
          }
      }, {})

      this.nameData = newNameData
    },
  },
  persist: {
    key: SEAT_DATA_LOCAL_STORAGE_KEY,
  },
})
