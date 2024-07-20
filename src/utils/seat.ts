import { type SeatData, type SeatRowData } from '@/constants/seat'

const DEFAULT_SEAT_DATA: SeatData = {
  assignedNumber: null,
  isExcluded: false,
}

/**
 * Make an initial seat data from column and row size.
 * @param columnSize
 * @param rowSize
 * @param originalData Optional. Original seat data to modify. If provided, it will shrink or expand the data based on the new size.
 * @returns An array of seat data filled with `null`.
 */
export const initializeSeatData = (
  columnSize: number,
  rowSize: number,
  originalData?: SeatRowData,
): SeatRowData => {
  // Intialize new data
  if (originalData === undefined)
    return [...new Array(rowSize)].map(() => Array<SeatData>(columnSize).fill(DEFAULT_SEAT_DATA))

  // Modify the data

  // Add rows
  if (originalData.length < rowSize)
    originalData.unshift(
      ...Array(rowSize - originalData.length).fill(
        Array<SeatData>(columnSize).fill(DEFAULT_SEAT_DATA),
      ),
    )
  else if (originalData.length > rowSize) originalData.splice(rowSize)

  // Add columns
  const newSeatData: SeatRowData = originalData.map((row) => {
    const newRow = [...row]

    if (newRow.length < columnSize) {
      // Fill the row with default data if the row is shorter than the column size
      newRow.push(...Array<SeatData>(columnSize - newRow.length).fill(DEFAULT_SEAT_DATA))
    } else if (newRow.length > columnSize) {
      // Shrink the row if the row is longer than the column size
      newRow.splice(columnSize)
    }

    return newRow
  })

  return newSeatData
}

/**
 * Get total number of seats that are not excluded.
 * @param data Seat row data
 * @returns Total number of seats
 */
export const getTotalNumberOfSeats = (data: SeatRowData): number =>
  data.flat().filter((seat) => !seat.isExcluded).length

/**
 * Assign random numbers to every seat that is included.
 * @param data Seat row data
 * @returns Shuffled seat row data
 */
export const getShuffledSeatData = (data: SeatRowData): SeatRowData => {
  const totalNumber = getTotalNumberOfSeats(data)

  /**
   * Array containing random numbers from 1 to `totalNumber`.
   */
  const randomNumbers: number[] = Array.from(Array(totalNumber).keys(), (n) => n + 1)
  randomNumbers.sort(() => Math.random() - 0.5)

  let currentIndex: number = 0

  const newData: SeatRowData = data.map((row) =>
    row.map((seat): SeatData => {
      // If the seat is excluded, do not assign random numbers
      if (seat.isExcluded) return { ...seat, assignedNumber: null }

      // If the seat is included, assign a random number
      // from `randomNumbers` array
      const newSeat: SeatData = {
        ...seat,
        assignedNumber: randomNumbers[currentIndex],
      }
      currentIndex++

      return newSeat
    }),
  )

  return newData
}

/**
 * Get seat size from seat row data.
 * @param data Seat row data
 * @returns Object that contains column and row size
 */
export const getSeatSize = (
  data: SeatRowData,
): {
  columnSize: number
  rowSize: number
} => ({
  columnSize: data[0].length,
  rowSize: data.length,
})
