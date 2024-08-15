import { initializeSeatData } from '@/utils/seat'

export type SeatData = {
  assignedNumber: number | null
  isExcluded: boolean
}

export type SeatColumnData = SeatData[]
export type SeatRowData = SeatColumnData[]

export type SeatPosition = [columnPos: number, rowPos: number]

export const DEFAULT_COLUMN_SIZE = 6,
  DEFAULT_ROW_SIZE = 5,
  DEFAULT_SEAT_ROW_DATA: SeatRowData = initializeSeatData(DEFAULT_COLUMN_SIZE, DEFAULT_ROW_SIZE)

// Seat sizes
export const MAX_SEAT_COLUMN_SIZE = 20,
  MIN_SEAT_COLUMN_SIZE = 2

export const MAX_SEAT_ROW_SIZE = 20,
  MIN_SEAT_ROW_SIZE = 2

// Seat number
export const MIN_SEAT_NUMBER = 2

// Pinia store
export const SEAT_DATA_LOCAL_STORAGE_KEY = 'seat-data-state'
