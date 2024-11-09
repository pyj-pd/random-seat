<script setup lang="ts">
import CustomButton from '@/components/common/ShadowButton.vue'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { waitMs } from '@/utils/time'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import confetti from 'canvas-confetti'
import { useEventListener } from '@/composables/useEventListener'
import { storeToRefs } from 'pinia'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import screenfull from 'screenfull'
import {
  getTableSvgViewbox,
  TABLE_SEAT_GAP,
  TABLE_SEAT_HEIGHT,
  TABLE_SEAT_WIDTH,
} from '@/utils/seat-svg'

/**nvm u
 * Initial delay between each shuffle in milliseconds.
 */
const DEFAULT_SHUFFLE_DELAY_MS = 50,
  /**
   * Wait this times until the delay actually starts to get increased.
   */
  SHUFFLE_DELAY_START_AFTER_NUMBERS = 50,
  /**
   * The factor by which the delay increases after each shuffle.
   */
  SHUFFLE_DELAY_INCREASE = 1.025,
  /**
   * Shuffling will end after reaching this amount of delay(miliseconds).
   */
  SHUFFLE_END_DELAY = 950

const SHUFFLE_SOUND_VOLUME = 5,
  SHUFFLE_SOUND_PLAYBACK_RATE = 3,
  SHUFFLE_DONE_SOUND_PLAYBACK_RATE = 1.5

const ROULETTE_AUDIO_LOCATION = '/sounds/roulette.mp3',
  ROULETTE_DONE_AUDIO_LOCATION = '/sounds/roulette-done.mp3'

let audioContext: AudioContext, gainNode: GainNode

let rouletteAudioBuffer: AudioBuffer, rouletteDoneAudioBuffer: AudioBuffer

let isUnmounted: boolean = false

const seatSizeStore = useSeatSizeStore()
const { shuffleSeats, clearSeatData } = seatSizeStore
const { columnSize, rowSize, seatData, nameData } = storeToRefs(seatSizeStore)

type PickingState = 'initial' | 'picking' | 'idle' | 'done'

const pickingState = ref<PickingState>('initial')

/**
 * For setting SVG size based on column and row size,
 * so that styles like border width or font size doesn't look
 * too big in small size or too small in big size.
 */
const tableSvgViewbox = computed(() =>
  getTableSvgViewbox({ columnSize: columnSize.value, rowSize: rowSize.value }),
)

// Fullscreen handling
const containerRef = ref<HTMLDivElement | null>(null),
  isFullscreen = ref<boolean>(false)

const toggleFullscreen = () => {
  if (screenfull.isEnabled && !screenfull.isFullscreen && containerRef.value)
    screenfull.request(containerRef.value, {
      navigationUI: 'hide',
    })
  else screenfull.exit()
}

const onFullscreenChange = () => {
  isFullscreen.value = screenfull.isFullscreen
  isControlHidden.value = false
}

onMounted(() => {
  if (screenfull.isEnabled) screenfull.on('change', onFullscreenChange)
})

onBeforeUnmount(() => {
  try {
    screenfull.off('change', onFullscreenChange)
  } catch {
    /* empty */
  }
})

// Control buttons handling
const isControlHidden = ref<boolean>(false)

watch(
  isControlHidden,
  (newStateHidden) =>
    // Hide cursor after inactivity
    (document.body.style.cursor = newStateHidden ? 'none' : 'unset'),
)
onBeforeUnmount(() => (document.body.style.cursor = 'unset')) // Reset cursor state before unmounting

const CONTROL_BUTTONS_HIDE_AFTER = 3_000 //ms

let buttonHiddenTimer: number

const startButtonHiddenTimer = () => {
  // Show button controls
  isControlHidden.value = false

  // Start timer
  clearTimeout(buttonHiddenTimer)
  buttonHiddenTimer = setTimeout(() => {
    if (isFullscreen.value) isControlHidden.value = true
  }, CONTROL_BUTTONS_HIDE_AFTER)
}

useEventListener(window, ['pointermove', 'pointerdown'], startButtonHiddenTimer, true)

// Confetti handling
const confettiCanvas = ref<HTMLCanvasElement | null>(null)
let confettiInstance: confetti.CreateTypes

onMounted(() => {
  if (confettiCanvas.value === null) return

  // Initialize confetti instance
  confettiInstance = confetti.create(confettiCanvas.value, {
    resize: true,
    useWorker: true,
  })
})

onBeforeUnmount(() => confettiInstance.reset()) // Destroy confetti instance

const launchConfetti = () =>
  confettiInstance({
    scalar: 1.5,
    shapes: ['circle'],
    spread: 300,
    particleCount: 250,
    origin: {
      x: 0.5,
      y: 0.5,
    },
  })

/**
 * How many times the seat has been picked since last reset.
 */
const howManyPicks = ref<number>(0)

/**
 * Start shuffling the seat data.
 */
const startRandomPick = async () => {
  if (pickingState.value === 'picking') return // nope !

  pickingState.value = 'picking'
  howManyPicks.value++
  if (isFullscreen.value) isControlHidden.value = true

  let shuffleDelay: number = DEFAULT_SHUFFLE_DELAY_MS,
    /**
     * Count down how many shuffles are left before increasing delay.
     */
    startDelayRemaining = SHUFFLE_DELAY_START_AFTER_NUMBERS

  while (!isUnmounted && shuffleDelay <= SHUFFLE_END_DELAY) {
    shuffleSeats()
    playSound(rouletteAudioBuffer, { playbackRate: SHUFFLE_SOUND_PLAYBACK_RATE })

    await waitMs(shuffleDelay)

    if (startDelayRemaining <= 0) shuffleDelay **= SHUFFLE_DELAY_INCREASE
    else startDelayRemaining--
  }

  if (!isUnmounted) {
    // Play roulette done sound
    playSound(rouletteDoneAudioBuffer, { playbackRate: SHUFFLE_DONE_SOUND_PLAYBACK_RATE })

    pickingState.value = 'done'

    // Confetti
    launchConfetti()
  } else {
    pickingState.value = 'idle'
  }
}

/**
 * Play a sound once.
 * @param buffer Audio buffer of the sound.
 * @param options Options for the sound.
 * @param options.playbackRate Playback rate of the sound.
 */
const playSound = (buffer: AudioBuffer, options?: Partial<{ playbackRate: number }>) => {
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  if (options?.playbackRate) source.playbackRate.value = options.playbackRate
  source.connect(gainNode)
  source.start()
}

/**
 * Load audio buffer from URL.
 * @param fileUrl Audio file URL.
 */
const loadAudioBuffer = async (fileUrl: string): Promise<AudioBuffer> => {
  const response = await fetch(fileUrl)
  const audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer())

  return audioBuffer
}

/**
 * Initialize audio context for sound effects.
 */
onMounted(async () => {
  audioContext = new AudioContext()

  gainNode = audioContext.createGain()
  gainNode.gain.value = SHUFFLE_SOUND_VOLUME
  gainNode.connect(audioContext.destination)

  // Roulette sound
  rouletteAudioBuffer = await loadAudioBuffer(ROULETTE_AUDIO_LOCATION)

  // Roulette done sound
  rouletteDoneAudioBuffer = await loadAudioBuffer(ROULETTE_DONE_AUDIO_LOCATION)
})

onBeforeUnmount(() => (isUnmounted = true))

/**
 * Reset seat data and random pick counts.
 */
const resetSeatData = () => {
  clearSeatData(null, true)
  howManyPicks.value = 0
}
</script>

<template>
  <main ref="containerRef" :class="$style.container">
    <canvas ref="confettiCanvas" :class="$style['confetti-canvas']"></canvas>
    <div ref="viewContainerRef" :class="$style['view-container']">
      <div :class="[$style['table-container'], { [$style.done]: pickingState === 'done' }]">
        <div :class="$style['random-pick-counter']">
          <span v-if="howManyPicks > 0" :key="howManyPicks">{{ howManyPicks }}번째 추첨</span>
        </div>
        <svg
          :class="$style.table"
          :viewBox="`0 0 ${tableSvgViewbox.width} ${tableSvgViewbox.height}`"
          preserveAspectRatio="xMidYMid"
        >
          <template v-for="(row, rowIndex) in seatData" :key="rowIndex">
            <g
              v-for="(seat, columnIndex) in row"
              :key="`${rowIndex},${columnIndex}`"
              :transform="`translate(${/* x */ columnIndex * (TABLE_SEAT_WIDTH + TABLE_SEAT_GAP)}, ${/* y */ rowIndex * (TABLE_SEAT_HEIGHT + TABLE_SEAT_GAP)})`"
              :class="[$style.seat, seat.isExcluded && $style.excluded]"
            >
              <rect :width="TABLE_SEAT_WIDTH" :height="TABLE_SEAT_HEIGHT" />
              <text
                v-if="seat.assignedNumber"
                :x="TABLE_SEAT_WIDTH / 2"
                :y="TABLE_SEAT_HEIGHT / 2"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                {{ nameData[seat.assignedNumber] ?? seat.assignedNumber }}
              </text>
            </g>
          </template>
        </svg>
      </div>
      <div :class="[$style['control-container'], { [$style.hidden]: isControlHidden }]">
        <span :class="$style['tap-info']">화면 탭 또는 마우스 움직여 버튼 보이기</span>
        <ButtonContainer :class="$style['button-container']">
          <CustomButton v-if="screenfull.isEnabled" @click="toggleFullscreen">{{
            !isFullscreen ? '전체화면으로 보기' : '전체화면 나가기'
          }}</CustomButton>
          <CustomButton :disabled="pickingState === 'picking'" warning @click="resetSeatData"
            >자리 초기화</CustomButton
          >
          <CustomButton
            :disabled="pickingState === 'picking'"
            :loading="pickingState === 'picking'"
            @click="startRandomPick"
            >뽑기</CustomButton
          >
        </ButtonContainer>
      </div>
    </div>
  </main>
</template>

<style module lang="scss">
@use '@/styles/seat' as seat;
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  &:fullscreen {
    @include value.paper-texture-background;
  }
}

.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  width: 100%;
  height: 100%;

  pointer-events: none;
}

.view-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;

  width: 100%;
  height: 100%;
}

// Table
.table-container {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
}

.table {
  & {
    z-index: -1;

    user-select: none;

    overflow: visible;
  }

  .container:not(:fullscreen) & {
    width: 100%;
    max-width: 800px;
  }

  .container:fullscreen & {
    width: 70%;
    height: 70%;
  }

  .done & {
    animation: roulette-done-animation 0.2s value.$ease-in-out both;
  }
}

// Seats

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
    stroke-width: seat.$border-width;
  }

  text {
    font-weight: 700;
    font-variant: proportional-nums;
    font-size: seat.$font-size;

    fill: seat.$text-color;
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

// Counter
.random-pick-counter {
  & > span {
    display: flex;
    justify-content: center;
    align-items: center;

    white-space: nowrap;

    font-size: 2rem;
    font-weight: 900;

    padding: 25px 60px;

    background-color: palette.$black;
    color: palette.$white;

    animation: random-pick-counter-animation 2s value.$ease-in-out both;
  }

  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    pointer-events: none;
  }
}

@keyframes random-pick-counter-animation {
  0%,
  100% {
    transform: scaleY(0);
  }
  10%,
  90% {
    transform: scaleY(1);
  }
}

// Controls
.control-container {
  .container:fullscreen & {
    position: absolute;
    bottom: value.$button-container-margin;
    left: 0;
  }

  & {
    width: 100%;

    display: flex;
    gap: value.$button-container-gap;
    flex-direction: column;
    align-items: center;

    transition: value.$animation-duration value.$animation-ease;
    transition-property: opacity, transform;
  }

  .container:not(:fullscreen) & > .tap-info {
    display: none;
  }

  &.hidden {
    transform: translateY(10px);
    opacity: 0;

    pointer-events: none;
  }
}

.button-container {
  .container:fullscreen & {
    button {
      backdrop-filter: blur(value.$button-backdrop-blur);
    }
  }

  & {
    flex: 0 0 auto;
  }
}
</style>
