import { useOptionStore } from '@/stores/useOptionStore'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import {
  TABLE_SEAT_WIDTH,
  TABLE_SEAT_GAP,
  TABLE_SEAT_HEIGHT,
  TABLE_TOP_INDICATOR_HEIGHT,
  TABLE_TOP_INDICATOR_GAP,
  TABLE_TOP_INDICATOR_WIDTH,
} from '@/styles/seat-svg'
import type { SeatSize, SeatPosition } from '@/types/seat'
import { reversed, safeClone } from '@/utils/array'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export const useSeatSvg = () => {
  const { seatData: originalSeatData, columnSize, rowSize } = storeToRefs(useSeatDataStore())
  const { invertVertical } = storeToRefs(useOptionStore())

  // Table SVG viewbox
  const _getTableSvgViewbox = ({
    columnSize,
    rowSize,
  }: SeatSize): { width: number; height: number } => {
    const width = columnSize * (TABLE_SEAT_WIDTH + TABLE_SEAT_GAP) - TABLE_SEAT_GAP,
      height =
        rowSize * (TABLE_SEAT_HEIGHT + TABLE_SEAT_GAP) +
        (TABLE_TOP_INDICATOR_HEIGHT + TABLE_TOP_INDICATOR_GAP)

    return { width, height }
  }

  const tableViewbox = computed(() =>
    _getTableSvgViewbox({ columnSize: columnSize.value, rowSize: rowSize.value }),
  )

  // Top indicator
  const _getTableSvgTopIndicatorTransform = (): string => {
    const x = tableViewbox.value.width / 2 - TABLE_TOP_INDICATOR_WIDTH / 2 // center

    const y = invertVertical.value
      ? tableViewbox.value.height - TABLE_TOP_INDICATOR_HEIGHT // bottom
      : 0 // top

    return `translate(${x}, ${y})`
  }

  const topIndicatorTransform = computed(() => _getTableSvgTopIndicatorTransform())

  // Individual seat
  const getTableSvgSeatTransform = ({ columnPos, rowPos }: SeatPosition): string => {
    const x = columnPos * (TABLE_SEAT_WIDTH + TABLE_SEAT_GAP)

    let y = TABLE_SEAT_GAP + rowPos * (TABLE_SEAT_HEIGHT + TABLE_SEAT_GAP)
    if (!invertVertical.value) y += TABLE_TOP_INDICATOR_HEIGHT + TABLE_TOP_INDICATOR_GAP // Add gap for top indicator if not inverted

    return `translate(${x}, ${y})`
  }

  // Seat data inversion
  const seatData = computed(() => {
    if (!invertVertical.value) return originalSeatData.value

    // Invert seat data
    return reversed(safeClone(originalSeatData.value)).map((row) => reversed(row))
  })

  return {
    tableViewbox,
    topIndicatorTransform,
    getTableSvgSeatTransform,
    seatData,
  }
}
