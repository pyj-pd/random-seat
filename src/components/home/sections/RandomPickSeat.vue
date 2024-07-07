<script setup lang="ts">
import CustomButton from '@/components/common/ShadowButton.vue'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { waitMs } from '@/utils/time'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import confetti from 'canvas-confetti'
import { useEventListener } from '@/composables/useEventListener'

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
const { shuffleSeats } = seatSizeStore

const { seatData } = storeToRefs(seatSizeStore)

type PickingState = 'initial' | 'picking' | 'idle' | 'done'

const pickingState = ref<PickingState>('initial')

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
 * Start shuffling the seat data.
 */
const startRandomPick = async () => {
  if (pickingState.value === 'picking') return // nope !

  pickingState.value = 'picking'

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

useEventListener(
  document,
  'fullscreenchange',
  () => (isFullscreen.value = document.fullscreenElement !== null),
)
</script>

<template>
  <main :class="$style.container" ref="containerRef">
    <canvas ref="confettiCanvas" :class="$style['confetti-canvas']"></canvas>
    <div :class="$style['scroll-view-container']">
      <div :class="[$style['table-container'], { [$style.done]: pickingState === 'done' }]">
        <span :class="$style['top-indicator']"></span>
        <div :class="$style.table">
          <div :class="$style.row" v-for="(row, rowIndex) in seatData" :key="rowIndex">
            <div
              v-for="(column, columnIndex) in row"
              :key="`${rowIndex},${columnIndex}`"
              :class="[$style.seat, { [$style.excluded]: column.isExcluded }]"
            >
              {{ column.assignedNumber }}
            </div>
          </div>
        </div>
      </div>
      <div :class="$style['button-container']">
        <CustomButton @click="toggleFullscreen">{{
          !isFullscreen ? '전체화면으로 보기' : '전체화면 나가기'
        }}</CustomButton>
        <CustomButton
          @click="startRandomPick"
          :disabled="pickingState === 'picking'"
          :loading="pickingState === 'picking'"
          >뽑기</CustomButton
        >
      </div>
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

.scroll-view-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;

  width: 100%;

  padding: 20px;

  overflow-x: auto;
}

.table-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  margin: auto;

  width: fit-content;

  white-space: nowrap;
  flex: 0 0 auto;

  &.done {
    animation: roulette-done-animation 0.2s value.$ease-in-out both;
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

.top-indicator {
  display: block;

  width: 10%;
  height: value.$border-width;

  background-color: palette.$blackish;
}

$table-spacing: 10px;

.table {
  display: flex;
  flex-direction: column;
  gap: $table-spacing;

  & > .row {
    display: flex;
    gap: $table-spacing;
  }
}

.seat {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 95px;
  height: 65px;

  background-color: palette.$dark-gray;
  color: palette.$black;

  font-size: 1.3rem;
  font-weight: 700;

  border: solid value.$border-slim-width palette.$blackish;

  &.excluded {
    background-color: palette.$gray;

    display: none;
  }

  .container:fullscreen & {
    width: 150px;
    height: 100px;

    font-size: 1.7rem;

    border-width: value.$border-width;
  }

  > button {
    width: 100%;
    height: 100%;
  }
}

.button-container {
  display: flex;
  gap: value.$button-container-gap;

  margin: auto;

  flex: 0 0 auto;
  white-space: nowrap;
}
</style>
