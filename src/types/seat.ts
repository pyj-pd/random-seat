// Name data
export type SeatNameData = {
  /**
   * Key should be seat 'number', not index(starting from 0).
   * Therefore it should start from 1.
   */
  [key: number]: string
}

// Seat data
export type SeatData = {
  assignedNumber: number | null
  isExcluded: boolean
}

export type SeatColumnData = SeatData[]
export type SeatRowData = SeatColumnData[]

export type SeatPosition = [columnPos: number, rowPos: number]
