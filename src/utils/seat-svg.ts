import type { FontSize } from '@/types/seat-svg'

export const SVG_VIEWBOX_WIDTH = 1_000

export const SEAT_GAP = 15,
  SEAT_ASPECT_RATIO = 10 / 7,
  /**
   * Seat font size should be calculated by following expression:
   * `(SVG seat width) * (This value)`
   */
  SEAT_FONT_SIZE_RATIO = 0.015

export type SvgSeatSize = {
  width: number
  height: number
  fontSize: FontSize
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
    const width = (SVG_VIEWBOX_WIDTH - SEAT_GAP * (this.columnSize - 1)) / this.columnSize,
      height = width / SEAT_ASPECT_RATIO,
      fontSize: FontSize = `${width * SEAT_FONT_SIZE_RATIO}rem`

    return { width, height, fontSize }
  }

  /**
   * Get height of SVG.
   * @returns Height of SVG
   */
  getSvgHeight(): number {
    const { height } = this.getSeatSize()

    const svgHeight = height * this.rowSize + SEAT_GAP * (this.rowSize - 1)

    return svgHeight
  }
}
