// Name data
export type SeatNameData = {
  /**
   * Key should be seat 'number', not index(starting from 0).
   * Therefore it should start from 1.
   */
  [key: number]: string
}

// Seat data
export type IndividualSeatData = {
  assignedNumber: number | null
  isExcluded: boolean
}

export type SeatRowData = IndividualSeatData[]
export type SeatData = SeatRowData[]

export type SeatPosition = { columnPos: number; rowPos: number }
export type SeatSize = { columnSize: number; rowSize: number }

export type SeatOrientation = 'landscape' | 'portrait'

export type SeatPickingState = 'initial' | 'picking' | 'idle' | 'done'
