<script setup lang="ts">
import CustomButton from '@/components/common/CustomButton.vue'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { waitMs } from '@/utils/time'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const DEFAULT_SHUFFLE_DELAY_MS = 50,
  SHUFFLE_DELAY_INCREASE = 1.12,
  SHUFFLE_DELAY_START_AFTER = 50,
  SHUFFLE_END_DELAY = 950

const AUDIO_LOCATION = '/sounds/roulette.mp3'

let audioContext: AudioContext, gainNode: GainNode, audioBuffer: AudioBuffer

const seatSizeStore = useSeatSizeStore()
const { shuffleSeats } = seatSizeStore

const { seatData } = storeToRefs(seatSizeStore)

type PickingState = null | {
  seconds: number
}

const pickingState = ref<PickingState>(null)

const startRandomPick = async () => {
  let shuffleDelay: number = DEFAULT_SHUFFLE_DELAY_MS,
    startDelayRemaining = SHUFFLE_DELAY_START_AFTER

  while (shuffleDelay <= SHUFFLE_END_DELAY) {
    shuffleSeats()
    playSound()

    await waitMs(shuffleDelay)

    if (startDelayRemaining <= 0) shuffleDelay *= SHUFFLE_DELAY_INCREASE
    else startDelayRemaining--
  }

  console.log('end')

  pickingState.value = null
}

const playSound = () => {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.playbackRate.value = 3
  source.connect(gainNode)
  source.start()
}

onMounted(async () => {
  audioContext = new AudioContext()

  gainNode = audioContext.createGain()
  gainNode.gain.value = 70
  gainNode.connect(audioContext.destination)

  const response = await fetch(AUDIO_LOCATION)
  audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer())
})
</script>

<template>
  <main :class="$style.container">
    <div>
      <table :class="$style.table">
        <tbody>
          <tr v-for="(row, rowIndex) in seatData" :key="rowIndex">
            <td v-for="(column, columnIndex) in row" :key="`${rowIndex},${columnIndex}`">
              {{ column.assignedNumber }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CustomButton @click="startRandomPick" :disabled="pickingState !== null">뽑기</CustomButton>
  </main>
</template>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.table {
  td {
    border: 1px solid black;

    > button {
      width: 100%;
      height: 100%;
    }
  }

  td,
  th {
    width: 60px;
    height: 50px;
  }
}
</style>
