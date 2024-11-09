import type { SeatPosition, SeatSize } from '@/types/seat'

// Seat
export const TABLE_SEAT_WIDTH = 120,
  TABLE_SEAT_HEIGHT = TABLE_SEAT_WIDTH / 1.8,
  TABLE_SEAT_GAP = 4,
  TABLE_BORDER_WIDTH = 1.5

// Table top indicator
export const TABLE_TOP_INDICATOR_WIDTH = 130,
  TABLE_TOP_INDICATOR_HEIGHT = TABLE_SEAT_HEIGHT / 1.4,
  TABLE_TOP_INDICATOR_BORDER_WIDTH = TABLE_BORDER_WIDTH,
  TABLE_TOP_INDICATOR_GAP = 10

export const getTableSvgViewbox = ({
  columnSize,
  rowSize,
}: SeatSize): { width: number; height: number } => {
  const width = columnSize * (TABLE_SEAT_WIDTH + TABLE_SEAT_GAP) - TABLE_SEAT_GAP,
    height =
      rowSize * (TABLE_SEAT_HEIGHT + TABLE_SEAT_GAP) +
      (TABLE_TOP_INDICATOR_HEIGHT + TABLE_TOP_INDICATOR_GAP)

  return { width, height }
}

export const getTableSvgSeatTransform = ({ columnPos, rowPos }: SeatPosition): string => {
  const x = columnPos * (TABLE_SEAT_WIDTH + TABLE_SEAT_GAP),
    y =
      TABLE_TOP_INDICATOR_HEIGHT +
      TABLE_TOP_INDICATOR_GAP +
      TABLE_SEAT_GAP +
      rowPos * (TABLE_SEAT_HEIGHT + TABLE_SEAT_GAP)

  return `translate(${x}, ${y})`
}

export const getTableSvgTopIndicatorTransform = (tableWidth: number): string => {
  const x = tableWidth / 2 - TABLE_TOP_INDICATOR_WIDTH / 2,
    y = 0

  return `translate(${x}, ${y})`
}
