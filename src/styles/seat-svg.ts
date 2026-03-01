/**
 * DO NOT USE CSS VARIABLES FOR SVG STYLING.
 *
 * CSS variables is hard to deal with when exporting SVG as text.
 * So we have to put these values directly into DOM.
 */

export const TABLE_OVERFLOW = 'visible',
  TABLE_FONT_WEIGHT = 700,
  TABLE_FONT_VARIANT = 'proportional-nums'

// Seat
export const TABLE_SEAT_WIDTH = 120,
  TABLE_SEAT_HEIGHT = TABLE_SEAT_WIDTH / 1.8,
  TABLE_SEAT_GAP = 4,
  TABLE_BORDER_WIDTH = 1.5

export const TABLE_SEAT_FONT_SIZE = 17

// Seat number
export const TABLE_SEAT_NUMBER_PADDING = 5,
  TABLE_SEAT_NUMBER_FONT_SIZE = 15

// Table top indicator
export const TABLE_TOP_INDICATOR_WIDTH = 130,
  TABLE_TOP_INDICATOR_HEIGHT = TABLE_SEAT_HEIGHT / 1.4,
  TABLE_TOP_INDICATOR_BORDER_WIDTH = TABLE_BORDER_WIDTH,
  TABLE_TOP_INDICATOR_GAP = 10,
  TABLE_TOP_INDICATOR_FONT_SIZE = 17

// Colors
export const TABLE_BORDER_COLOR = '#000000',
  TABLE_TEXT_COLOR = '#000000'

export const TABLE_SEAT_BACKGROUND_COLOR = '#ffffff'
