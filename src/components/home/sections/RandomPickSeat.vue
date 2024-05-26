<script setup lang="ts">
import CustomButton from '@/components/common/CustomButton.vue'
import { useSeatSizeStore } from '@/stores/useSeatSizeStore'
import { waitMs } from '@/utils/time'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const DEFAULT_SHUFFLE_DELAY_MS = 1.2,
  SHUFFLE_DELAY_INCREASE = 1.08,
  SHUFFLE_END_DELAY = 850

const AUDIO_LOCATION = '/sounds/roulette.mp3'

let audioContext: AudioContext, audioBuffer: AudioBuffer

const seatSizeStore = useSeatSizeStore()
const { shuffleSeats } = seatSizeStore

const { seatData } = storeToRefs(seatSizeStore)

type PickingState = null | {
  seconds: number
}

const pickingState = ref<PickingState>(null)

const startRandomPick = async () => {
  let shuffleDelay: number = DEFAULT_SHUFFLE_DELAY_MS

  while (shuffleDelay <= SHUFFLE_END_DELAY) {
    shuffleSeats()
    playSound()

    await waitMs(shuffleDelay)
    shuffleDelay *= SHUFFLE_DELAY_INCREASE
  }

  console.log('end')

  pickingState.value = null
}

const playSound = () => {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.playbackRate.value = 4
  source.connect(audioContext.destination)
  source.start()
}

onMounted(async () => {
  audioContext = new AudioContext()

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
