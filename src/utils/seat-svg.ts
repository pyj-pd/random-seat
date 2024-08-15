import type { PxSize } from '@/types/seat-svg'

export const SVG_VIEWBOX_WIDTH = 1_000

export const SEAT_GAP_RATIO = 1 / 10 /* of seat width */,
  SEAT_ASPECT_RATIO = 10 / 7,
  BORDER_WIDTH_RATIO = 1 / 80 /* of seat width */,
  /**
   * Seat font size should be calculated by following expression:
   * `(SVG seat width) * (This value)`
   */
  SEAT_FONT_SIZE_RATIO = 0.18

export type SvgSeatSize = {
  width: number
  height: number
  gap: number
  borderWidth: PxSize
  fontSize: PxSize
}

export class SeatSvg {
  columnSize: number
  rowSize: number

  constructor(columnSize: number, rowSize: number) {
    ;[this.columnSize, this.rowSize] = [columnSize, rowSize]
  }

  /**
   * Get seat size in a scale of the viewbox width.
   * @returns Object that contains width and height
   */
  getSeatSize(): SvgSeatSize {
    // Before calculations
    const rawWidth = SVG_VIEWBOX_WIDTH / this.columnSize,
      rawHeight = rawWidth / SEAT_ASPECT_RATIO

    // After calculation
    const gap = rawWidth * SEAT_GAP_RATIO,
      width = rawWidth - gap,
      height = rawHeight - gap,
      fontSize: PxSize = `${width * SEAT_FONT_SIZE_RATIO}px`,
      borderWidth: PxSize = `${width * BORDER_WIDTH_RATIO}px`

    return { width, height, gap, fontSize, borderWidth }
  }

  /**
   * Get height of SVG.
   * @returns Height of SVG
   */
  getSvgHeight(): number {
    const { height, gap } = this.getSeatSize()

    const svgHeight = height * this.rowSize + gap * (this.rowSize - 1)

    return svgHeight
  }
}
