// Name data
export type SeatNameData = {
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
