import { initializeSeatData } from '@/utils/array'

/**
 * Data of a seat.
 * * `null` if seats are not picked.
 * * `number` for assigned seat
 * * `false` for excluded seat.
 */
export type SeatData = null | number | false

export type SeatColumnData = SeatData[]
export type SeatRowData = SeatColumnData[]

export type SeatPosition = [columnPos: number, rowPos: number]

export const DEFAULT_COLUMN_SIZE = 6,
  DEFAULT_ROW_SIZE = 5,
  DEFAULT_SEAT_DATA: SeatRowData = initializeSeatData(DEFAULT_COLUMN_SIZE, DEFAULT_ROW_SIZE)
