import { DEFAULT_SEAT_DATA } from '@/constants/seat'
import { type IndividualSeatData, type SeatData, type SeatSize } from '@/types/seat'
import { safeClone } from './array'

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

export const computeSeatStats = (seatData: SeatData) => {
  const fixedAssigned = new Set<number>()
  let totalNumberOfSeats = 0

  for (const row of seatData) {
    for (const seat of row) {
      if (!seat.isExcluded) totalNumberOfSeats++
      if (seat.isFixed && seat.assignedNumber !== null) fixedAssigned.add(seat.assignedNumber)
    }
  }

  const fixedNumbers = Array.from(fixedAssigned).sort((a, b) => a - b)

  const assignableNumbers: number[] = []
  for (let i = 1; i <= totalNumberOfSeats; i++) {
    if (!fixedAssigned.has(i)) assignableNumbers.push(i)
  }

  return { totalNumberOfSeats, fixedNumbers, assignableNumbers }
}

export const isSeatAssignable = (seat: IndividualSeatData): boolean =>
  Boolean(!(seat.isExcluded || seat.isFixed))

/**
 * Assign random numbers to every seat that is included.
 * @param originalSeatData Seat row data\
 * @param numberOfSeats Total number of seats to assign. It is used to generate the numbers to assign.
 * @returns Shuffled seat row data
 */
export const getShuffledSeatData = (
  originalSeatData: SeatData,
  assignableSeatNumbers: number[],
): SeatData => {
  const numbersToAssign = [...assignableSeatNumbers]

  const newSeatData = safeClone(originalSeatData)

  for (const row of newSeatData) {
    for (const seat of row) {
      if (!isSeatAssignable(seat)) {
        if (seat.isExcluded) seat.assignedNumber = null

        continue
      }

      const randomIndex = Math.floor(Math.random() * numbersToAssign.length)
      const assignedNumber = numbersToAssign[randomIndex]

      seat.assignedNumber = assignedNumber

      // Remove the assigned number from the array
      numbersToAssign.splice(randomIndex, 1)
    }
  }

  return newSeatData
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
