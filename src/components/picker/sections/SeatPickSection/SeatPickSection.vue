<script setup lang="ts">
import CustomButton from '@/components/common/ShadowButton.vue'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import { waitMs } from '@/utils/time'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import confetti from 'canvas-confetti'
import { storeToRefs } from 'pinia'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import { getTableSvgViewbox } from '@/utils/seat-svg'
import { useEventListener, useFullscreen, useScreenOrientation } from '@vueuse/core'
import SeatSvg from './SeatSvg.vue'
import RandomPickCounter from './RandomPickCounter.vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import {
  SHUFFLE_SOUND_VOLUME,
  DEFAULT_SHUFFLE_DELAY_MS,
  SHUFFLE_DELAY_START_AFTER_NUMBERS,
  SHUFFLE_END_DELAY,
  SHUFFLE_SOUND_PLAYBACK_RATE,
  SHUFFLE_DELAY_INCREASE,
  SHUFFLE_DONE_SOUND_PLAYBACK_RATE,
  ROULETTE_AUDIO_LOCATION,
  ROULETTE_DONE_AUDIO_LOCATION,
} from '@/constants/picker'
import { downloadExportedSeatToPDF, generatePDFFileName } from '@/utils/pdf'

const { playSound, loadAudioFile } = useAudioPlayer({ volume: SHUFFLE_SOUND_VOLUME })

let rouletteAudioBuffer: AudioBuffer, rouletteDoneAudioBuffer: AudioBuffer

let isUnmounted: boolean = false

const seatDataStore = useSeatDataStore(),
  { shuffleSeats, clearSeatData } = seatDataStore,
  { columnSize, rowSize, orientation } = storeToRefs(seatDataStore)

type PickingState = 'initial' | 'picking' | 'idle' | 'done'

const pickingState = ref<PickingState>('initial')

const isPicking = computed(() => pickingState.value === 'picking')

/**
 * For setting SVG size based on column and row size,
 * so that styles like border width or font size doesn't look
 * too big in small size or too small in big size.
 */
const tableSvgViewbox = computed(() =>
  getTableSvgViewbox({ columnSize: columnSize.value, rowSize: rowSize.value }),
)

// Fullscreen handling
const containerRef = useTemplateRef<HTMLDivElement>('container-ref')

const {
  isFullscreen,
  enter: enterFullscreen,
  exit: exitFullscreen,
  isSupported: isFullscreenSupported,
} = useFullscreen(containerRef)
const { isSupported: isOrientationSupported, lockOrientation } = useScreenOrientation()

const toggleFullscreen = () => {
  if (isFullscreenSupported.value && !isFullscreen.value && containerRef.value) {
    enterFullscreen()

    if (isOrientationSupported.value) {
      lockOrientation(orientation.value).catch(() => null)
    }
  } else exitFullscreen()
}

// Control buttons handling
const isControlInactive = ref<boolean>(false)

watch(
  isControlInactive,
  (newStateHidden) =>
    // Hide cursor after inactivity
    (document.body.style.cursor = newStateHidden ? 'none' : 'unset'),
)
onBeforeUnmount(() => (document.body.style.cursor = 'unset')) // Reset cursor state before unmounting

const CONTROL_BUTTON_INACTIVE_AFTER = 3_000 //ms

let buttonInactiveTimer: ReturnType<typeof setTimeout>

const startButtonInactiveTimer = (event?: PointerEvent) => {
  if (isControlInactive.value) event?.preventDefault()

  // Show button controls
  isControlInactive.value = false

  // Start timer
  clearTimeout(buttonInactiveTimer)
  buttonInactiveTimer = setTimeout(() => {
    if (isFullscreen.value) isControlInactive.value = true
  }, CONTROL_BUTTON_INACTIVE_AFTER)
}

useEventListener(window, ['pointermove', 'pointerdown'], startButtonInactiveTimer)
onMounted(() => startButtonInactiveTimer())

// Confetti handling
const confettiCanvas = useTemplateRef<HTMLCanvasElement>('confetti-canvas')
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
const pickCount = ref<number>(0)

/**
 * Start shuffling the seat data.
 */
const startRandomPick = async () => {
  if (pickingState.value === 'picking') return // nope !

  pickingState.value = 'picking'
  pickCount.value++
  if (isFullscreen.value) isControlInactive.value = true

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
 * Load audio files for sound effects
 */
onMounted(async () => {
  // Roulette sound
  rouletteAudioBuffer = await loadAudioFile(ROULETTE_AUDIO_LOCATION)

  // Roulette done sound
  rouletteDoneAudioBuffer = await loadAudioFile(ROULETTE_DONE_AUDIO_LOCATION)
})

onBeforeUnmount(() => (isUnmounted = true))

/**
 * Reset seat data and random pick counts.
 */
const resetSeatData = () => {
  clearSeatData(null, true)
  pickCount.value = 0
}

// Export to PDF
const seatRef = useTemplateRef('seat-svg')
const isPDFExporting = ref<boolean>(false)

const saveSeatAsPDF = async () => {
  if (seatRef.value === null) return

  const svgElement = seatRef.value.getSVGElement()

  if (svgElement === null) return

  isPDFExporting.value = true

  try {
    const fileName = generatePDFFileName()

    await downloadExportedSeatToPDF(svgElement, orientation.value, fileName)
  } catch (error) {
    alert('PDF로 저장하는 과정에서 오류가 발생했습니다.')
  } finally {
    isPDFExporting.value = false
  }
}
</script>

<template>
  <main ref="container-ref" :class="$style.container">
    <canvas ref="confetti-canvas" :class="$style['confetti-canvas']"></canvas>
    <div :class="$style['view-container']">
      <div :class="$style['table-container']">
        <RandomPickCounter :pick-count="pickCount" />
        <SeatSvg
          ref="seat-svg"
          :viewBox="tableSvgViewbox"
          :isDone="pickingState === 'done'"
          :isFullscreen="isFullscreen"
        />
      </div>
      <ButtonContainer
        :class="[$style['button-container'], { [$style.inactive]: isControlInactive }]"
        sticky
      >
        <CustomButton v-if="isFullscreenSupported" @click="toggleFullscreen">{{
          !isFullscreen ? '전체화면으로 보기' : '전체화면 나가기'
        }}</CustomButton>
        <CustomButton :disabled="isPicking" warning @click="resetSeatData"
          >자리 초기화</CustomButton
        >
        <CustomButton :disabled="isPicking" :loading="isPicking" @click="startRandomPick"
          >뽑기</CustomButton
        >
        <CustomButton
          :disabled="isPicking || isPDFExporting"
          @click="saveSeatAsPDF"
          :loading="isPDFExporting"
          >PDF로 저장</CustomButton
        >
      </ButtonContainer>
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
  align-self: center;

  padding: 20px;

  min-height: 100%;

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

// Controls
.button-container {
  transform: translateY(0px);
  opacity: 1;

  transition: value.$animation-duration value.$animation-ease;
  transition-property: opacity, transform;

  .container:fullscreen & {
    position: absolute;
  }

  &.inactive {
    transform: translateY(20px);
    opacity: 0.2;
  }
}
</style>
