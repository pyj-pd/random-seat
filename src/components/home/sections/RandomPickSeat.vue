<script setup lang="ts">
import CustomButton from '@/components/common/ShadowButton.vue'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { waitMs } from '@/utils/time'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import confetti from 'canvas-confetti'
import { useEventListener } from '@/composables/useEventListener'
import { storeToRefs } from 'pinia'
import { SEAT_GAP, SeatSvg, SVG_VIEWBOX_WIDTH, type SvgSeatSize } from '@/utils/seat-svg'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import MouseGuide from '../MouseGuide.vue'

/**
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
const { shuffleSeats, resetData } = seatSizeStore
const { columnSize, rowSize, seatData } = storeToRefs(seatSizeStore)

type PickingState = 'initial' | 'picking' | 'idle' | 'done'

const pickingState = ref<PickingState>('initial')

// Set SVG size based on column and row size
const svgRef = ref<HTMLOrSVGElement | null>(null)

const svgHeight = ref<number>(0),
  svgSeatSize = reactive<SvgSeatSize>({ width: 0, height: 0 })

watch(
  [columnSize, rowSize],
  (newSize) => {
    const svgInstance = new SeatSvg(...newSize)

    svgHeight.value = svgInstance.getSvgHeight()

    const { width, height } = svgInstance.getSeatSize()
    svgSeatSize.width = width
    svgSeatSize.height = height
  },
  {
    immediate: true,
  },
)

// Control buttons handling
const isControlHidden = ref<boolean>(false)

watch(isControlHidden, (newState) => (document.body.style.cursor = newState ? 'none' : 'unset')) // Hide cursor after inactivity
onBeforeUnmount(() => (document.body.style.cursor = 'unset')) // Reset cursor state before unmounting

const CONTROL_BUTTONS_HIDE_AFTER = 3_000 //ms

let buttonHiddenTimer: number

const startButtonHiddenTimer = () => {
  // Show button controls
  isControlHidden.value = false

  // Start timer
  clearTimeout(buttonHiddenTimer)
  buttonHiddenTimer = setTimeout(() => (isControlHidden.value = true), CONTROL_BUTTONS_HIDE_AFTER)
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
  isControlHidden.value = true

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
  resetData(undefined, undefined, true)
  howManyPicks.value = 0
}

// Fullscreen handling
const containerRef = ref<HTMLDivElement | null>(null),
  isFullscreen = ref<boolean>(false)

const toggleFullscreen = () => {
  if (document.fullscreenElement === null)
    containerRef.value?.requestFullscreen({
      navigationUI: 'hide',
    })
  else document.exitFullscreen()
}

useEventListener(document, 'fullscreenchange', () => {
  isFullscreen.value = document.fullscreenElement !== null
})
</script>

<template>
  <main :class="$style.container" ref="containerRef">
    <canvas ref="confettiCanvas" :class="$style['confetti-canvas']"></canvas>
    <div :class="$style['view-container']" ref="viewContainerRef">
      <div :class="[$style['table-container'], { [$style.done]: pickingState === 'done' }]">
        <div :class="$style['random-pick-counter']">
          <span :key="howManyPicks" v-if="howManyPicks > 0">{{ howManyPicks }}번째 추첨</span>
        </div>
        <svg
          ref="svgRef"
          :class="$style['table-svg']"
          :viewBox="`0 0 ${SVG_VIEWBOX_WIDTH} ${svgHeight}`"
          preserveAspectRatio="xMidYMid"
        >
          <!--Row -->
          <g v-for="(row, rowIndex) in seatData" :key="rowIndex">
            <!-- Seat -->
            <template v-for="(column, columnIndex) in row" :key="`${rowIndex},${columnIndex}`">
              <g v-if="!column.isExcluded" :class="$style.seat">
                <rect
                  :x="(svgSeatSize.width + SEAT_GAP) * columnIndex"
                  :y="(svgSeatSize.height + SEAT_GAP) * rowIndex"
                  :width="svgSeatSize.width"
                  :height="svgSeatSize.height"
                />
                <text
                  :x="(svgSeatSize.width + SEAT_GAP) * columnIndex + svgSeatSize.width / 2"
                  :y="(svgSeatSize.height + SEAT_GAP) * rowIndex + svgSeatSize.height / 2"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  font-size="1.8rem"
                >
                  {{ column.assignedNumber }}
                </text>
              </g>
            </template>
          </g>
        </svg>
      </div>
      <ButtonContainer :class="[$style['button-container'], { [$style.hidden]: isControlHidden }]">
        <CustomButton @click="toggleFullscreen">{{
          !isFullscreen ? '전체화면으로 보기' : '전체화면 나가기'
        }}</CustomButton>
        <div :style="{ position: 'relative' }">
          <CustomButton @click="resetSeatData" :disabled="pickingState === 'picking'" warning
            >초기화</CustomButton
          >
          <MouseGuide text="완전히 새로 뽑는다면 먼저 눌러주세요." />
        </div>
        <CustomButton
          @click="startRandomPick"
          :disabled="pickingState === 'picking'"
          :loading="pickingState === 'picking'"
          >뽑기</CustomButton
        >
      </ButtonContainer>
    </div>
  </main>
</template>

<style module lang="scss">
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  &:fullscreen {
    @include value.paper-texture-background(palette.$black);
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

.table-container {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
}

.table-svg {
  .container:not(:fullscreen) & {
    width: 100%;
    max-width: 800px;
  }

  .container:fullscreen & {
    width: 70%;
    height: 70%;
  }

  overflow: visible;

  .done & {
    animation: roulette-done-animation 0.2s value.$ease-in-out both;
  }
}

.seat {
  rect {
    stroke: palette.$darker-gray;
    stroke-width: 2.5px;

    fill: palette.$dark-gray;
  }

  text {
    font-size: 2rem;
    font-weight: 700;
    font-variant: proportional-nums;
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

.random-pick-counter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

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

  pointer-events: none;
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

.button-container {
  .container:fullscreen & {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;

    padding: 50px;

    transition: value.$animation-duration value.$animation-ease;
    transition-property: opacity, transform;

    button {
      backdrop-filter: blur(2px);
    }

    &.hidden {
      transform: translateY(10px);
      opacity: 0;

      pointer-events: none;
    }
  }

  flex: 0 0 auto;
}
</style>
