import { type IndividualSeatData, type SeatData, type SeatSize } from '@/types/seat'

const DEFAULT_SEAT_DATA: IndividualSeatData = {
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
  { columnSize, rowSize }: SeatSize,
  originalData?: SeatData,
): SeatData => {
  // Intialize new data
  if (originalData === undefined)
    return [...new Array(rowSize)].map(() =>
      Array<IndividualSeatData>(columnSize).fill(DEFAULT_SEAT_DATA),
    )

  // Modify the data

  // Add rows
  if (originalData.length < rowSize)
    originalData.unshift(
      ...Array(rowSize - originalData.length).fill(
        Array<IndividualSeatData>(columnSize).fill(DEFAULT_SEAT_DATA),
      ),
    )
  else if (originalData.length > rowSize) originalData.splice(rowSize)

  // Add columns
  const newSeatData: SeatData = originalData.map((row) => {
    const newRow = [...row]

    if (newRow.length < columnSize) {
      // Fill the row with default data if the row is shorter than the column size
      newRow.push(...Array<IndividualSeatData>(columnSize - newRow.length).fill(DEFAULT_SEAT_DATA))
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
export const getTotalNumberOfSeats = (data: SeatData): number =>
  data.flat().filter((seat) => !seat.isExcluded).length

/**
 * Assign random numbers to every seat that is included.
 * @param data Seat row data
 * @returns Shuffled seat row data
 */
export const getShuffledSeatData = (data: SeatData): SeatData => {
  const totalNumber = getTotalNumberOfSeats(data)

  /**
   * Array containing random numbers from 1 to `totalNumber`.
   */
  const numbers: number[] = Array.from(Array(totalNumber).keys(), (n) => n + 1),
    randomNumbers: number[] = []

  for (let i = 0; i < totalNumber; i++) {
    const numberLength = numbers.length
    const randomIndex = Math.floor(Math.random() * numberLength)

    randomNumbers.push(numbers[randomIndex]!)
    numbers.splice(randomIndex, 1)
  }

  let currentIndex: number = 0

  const newData: SeatData = data.map((row) =>
    row.map((seat): IndividualSeatData => {
      // If the seat is excluded, do not assign random numbers
      if (seat.isExcluded) return { ...seat, assignedNumber: null }

      // If the seat is included, assign a random number
      // from `randomNumbers` array
      const newSeat: IndividualSeatData = {
        ...seat,
        assignedNumber: randomNumbers[currentIndex]!,
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
  data: SeatData,
): {
  columnSize: number
  rowSize: number
} => ({
  columnSize: data[0]!.length,
  rowSize: data.length,
})
