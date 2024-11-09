import type { SeatSize } from '@/types/seat'

export const TABLE_SEAT_WIDTH = 120,
  TABLE_SEAT_HEIGHT = TABLE_SEAT_WIDTH / 1.8,
  TABLE_SEAT_GAP = 4

export const getTableSvgViewbox = ({
  columnSize,
  rowSize,
}: SeatSize): { width: number; height: number } => {
  const width = columnSize * (TABLE_SEAT_WIDTH + TABLE_SEAT_GAP) - TABLE_SEAT_GAP,
    height = rowSize * (TABLE_SEAT_HEIGHT + TABLE_SEAT_GAP) - TABLE_SEAT_GAP

  return { width, height }
}
