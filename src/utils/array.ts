import type { SeatRowData } from '@/constants/seat'

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
  if (originalData === undefined)
    return [...new Array(rowSize)].map(() => Array(columnSize).fill(null))

  // Modify the data
  if (originalData.length < rowSize)
    originalData.push(...Array(rowSize - originalData.length).fill(Array(columnSize).fill(null)))
  else if (originalData.length > rowSize) originalData.splice(rowSize)

  const newSeatData: SeatRowData = originalData.map((row) => {
    const newRow = [...row]

    if (newRow.length < columnSize) {
      // Fill the row with `null` if the row is shorter than the column size
      newRow.push(...Array(columnSize - newRow.length).fill(null))
    } else if (newRow.length > columnSize) {
      // Shrink the row if the row is longer than the column size
      newRow.splice(columnSize)
    }

    return newRow
  })

  return newSeatData
}
