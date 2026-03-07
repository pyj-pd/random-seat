<script setup lang="ts">
import { TOP_INDICATOR_TEXT } from '@/constants/seat'
import { useOptionStore } from '@/stores/useOptionStore'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import { getTableSvgSeatTransform, getTableSvgTopIndicatorTransform } from '@/utils/seat-svg'
import {
  TABLE_BORDER_COLOR,
  TABLE_BORDER_WIDTH,
  TABLE_SEAT_FONT_SIZE,
  TABLE_SEAT_HEIGHT,
  TABLE_SEAT_NUMBER_FONT_SIZE,
  TABLE_SEAT_NUMBER_PADDING,
  TABLE_TEXT_COLOR,
  TABLE_SEAT_WIDTH,
  TABLE_TOP_INDICATOR_BORDER_WIDTH,
  TABLE_TOP_INDICATOR_FONT_SIZE,
  TABLE_TOP_INDICATOR_HEIGHT,
  TABLE_TOP_INDICATOR_WIDTH,
  TABLE_SEAT_BACKGROUND_COLOR,
  TABLE_FONT_VARIANT,
  TABLE_FONT_WEIGHT,
  TABLE_OVERFLOW,
  TABLE_EXCLUDED_SEAT_BORDER_COLOR,
  TABLE_SEAT_NUMBER_ONLY_FONT_SIZE,
} from '@/styles/seat-svg'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'
import type { SeatPickingState } from '@/types/seat'

const { seatData, nameData } = storeToRefs(useSeatDataStore())
const { showSeatNumbers } = storeToRefs(useOptionStore())

const svgRef = useTemplateRef<SVGSVGElement>('svg-ref')

const getSVGElement = (): SVGSVGElement | null => {
  return svgRef.value
}

defineExpose({ getSVGElement })

defineProps<{
  viewBox: {
    width: number
    height: number
  }
  pickingState?: SeatPickingState
  isFullscreen: boolean
}>()
</script>

<template>
  <svg
    ref="svg-ref"
    :class="[
      $style.table,
      { [$style.picking]: pickingState === 'picking' },
      { [$style.done]: pickingState === 'done' },
      { [$style.fullscreen]: isFullscreen },
    ]"
    :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
    preserveAspectRatio="xMidYMid"
    :color="TABLE_TEXT_COLOR"
    :font-weight="TABLE_FONT_WEIGHT"
    :font-variant="TABLE_FONT_VARIANT"
    :overflow="TABLE_OVERFLOW"
  >
    <!-- Table top indicator -->
    <g
      :transform="getTableSvgTopIndicatorTransform(viewBox.width)"
      :class="$style['top-indicator']"
    >
      <rect
        :width="TABLE_TOP_INDICATOR_WIDTH"
        :height="TABLE_TOP_INDICATOR_HEIGHT"
        :stroke-width="TABLE_TOP_INDICATOR_BORDER_WIDTH"
        :stroke="TABLE_BORDER_COLOR"
        :fill="TABLE_SEAT_BACKGROUND_COLOR"
      />
      <text
        :x="TABLE_TOP_INDICATOR_WIDTH / 2"
        :y="
          TABLE_TOP_INDICATOR_HEIGHT / 2 +
          TABLE_TOP_INDICATOR_BORDER_WIDTH +
          TABLE_TOP_INDICATOR_FONT_SIZE / 4 // `dominant-baseline` can't be used because of jsPDF text rendering issue
        "
        text-anchor="middle"
        :font-size="TABLE_TOP_INDICATOR_FONT_SIZE"
      >
        {{ TOP_INDICATOR_TEXT }}
      </text>
    </g>
    <!-- Seats -->
    <template v-for="(row, rowIndex) in seatData" :key="rowIndex">
      <g
        v-for="(seat, columnIndex) in row"
        :key="`${rowIndex},${columnIndex}`"
        :transform="getTableSvgSeatTransform({ columnPos: columnIndex, rowPos: rowIndex })"
        :class="[$style.seat, { [$style.excluded]: seat.isExcluded }]"
      >
        <rect
          :width="TABLE_SEAT_WIDTH"
          :height="TABLE_SEAT_HEIGHT"
          :stroke-width="TABLE_BORDER_WIDTH"
          :stroke="seat.isExcluded ? TABLE_EXCLUDED_SEAT_BORDER_COLOR : TABLE_BORDER_COLOR"
          :fill="TABLE_SEAT_BACKGROUND_COLOR"
        />
        <template v-if="seat.assignedNumber">
          <!-- Seat number -->
          <text
            v-if="showSeatNumbers && nameData[seat.assignedNumber]"
            :x="TABLE_SEAT_NUMBER_PADDING"
            :y="TABLE_SEAT_NUMBER_PADDING + TABLE_SEAT_NUMBER_FONT_SIZE"
            text-anchor="start"
            :class="$style['seat-number']"
            :font-size="TABLE_SEAT_NUMBER_FONT_SIZE"
          >
            {{ seat.assignedNumber }}
          </text>
          <!-- Seat text(name/number) -->
          <text
            :x="TABLE_SEAT_WIDTH / 2"
            :y="
              TABLE_SEAT_HEIGHT / 2 +
              // @todo improve readability
              (nameData[seat.assignedNumber]
                ? TABLE_SEAT_FONT_SIZE
                : TABLE_SEAT_NUMBER_ONLY_FONT_SIZE) /
                4
            "
            text-anchor="middle"
            :font-size="
              nameData[seat.assignedNumber]
                ? TABLE_SEAT_FONT_SIZE
                : TABLE_SEAT_NUMBER_ONLY_FONT_SIZE
            "
          >
            {{ nameData[seat.assignedNumber] ?? seat.assignedNumber }}
          </text>
        </template>
      </g>
    </template>
  </svg>
</template>

<style lang="scss" module>
@use '@/styles/seat' as seat;
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.table {
  & {
    z-index: -1;

    user-select: none;
  }

  &:not(.fullscreen) {
    width: 100%;
    max-width: 1000px;
  }

  &.fullscreen {
    width: 70%;
    height: 80%;
  }

  &.picking,
  &.done {
    will-change: transform;
  }

  &.done {
    animation: roulette-done-animation 0.2s value.$ease-in-out both;
  }
}

// Table top indicator
.top-indicator {
  rect {
    fill: seat.$top-indicator-background-color;

    stroke: seat.$top-indicator-border-color;
  }

  text {
    fill: seat.$top-indicator-text-color;
  }
}

// Seat
.seat {
  &.excluded {
    rect {
      fill: seat.$excluded-background-color;

      stroke: seat.$excluded-border-color;
    }
  }

  rect {
    fill: seat.$background-color;

    stroke: seat.$border-color;
  }

  text {
    fill: seat.$text-color;
  }

  .seat-number {
    fill: seat.$seat-number-text-color;
  }
}

@keyframes roulette-done-animation {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
