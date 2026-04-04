<script setup lang="ts">
import NormalButton from '@/components/common/NormalButton.vue'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const { totalSeatNumber, fixedNumbers, nameData } = storeToRefs(useSeatDataStore())

withDefaults(
  defineProps<{
    isVisible?: boolean
  }>(),
  {
    isVisible: false,
  },
)

const emit = defineEmits<{
  select: [seatNumber: number | null]
}>()

const onModalBackgroundClick = (event: MouseEvent) => {
  if (event.target !== event.currentTarget) return

  emit('select', null) // Close modal without selecting a seat number
}

const onSeatNumberSelect = (seatNumber: number) => {
  emit('select', seatNumber)
}
</script>

<template>
  <!-- @todo a11y -->
  <Transition name="modal-transition">
    <div v-if="isVisible" :class="$style.container" @click="onModalBackgroundClick">
      <div :class="[$style['content-container'], 'modal-content']">
        <h3>고정할 번호를 선택해 주세요.</h3>
        <div :class="$style['select-container']">
          <NormalButton
            v-for="seatNumber of totalSeatNumber"
            :key="seatNumber"
            :class="$style['select-button']"
            :disabled="fixedNumbers.includes(seatNumber)"
            @click="onSeatNumberSelect(seatNumber)"
          >
            <div>{{ seatNumber }}번</div>
            <div>{{ nameData[seatNumber] || '' }}</div>
          </NormalButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" module>
@use '@/styles/palette' as palette;
@use '@/styles/value' as value;

.container {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  backdrop-filter: blur(5px);
}

.content-container {
  display: flex;
  gap: value.$button-container-gap;
  flex-direction: column;

  background-color: palette.$white;
  color: palette.$black;
  border: solid value.$border-width palette.$black;

  padding: value.$mini-section-padding;

  width: 100%;
  max-width: 300px;
  height: 100%;
  max-height: 700px;
}

.select-container {
  display: flex;
  gap: value.$button-container-small-gap;
  flex-direction: column;

  width: 100%;
  height: 100%;

  overflow-y: scroll;
}

.select-button {
  display: flex;

  > div {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
@use '@/styles/value' as value;

// Modal background
.modal-transition-enter-active,
.modal-transition-leave-active {
  transition: opacity value.$animation-duration value.$animation-ease;
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  opacity: 0;
}

// Modal content
.modal-transition-enter-active .modal-content,
.modal-transition-leave-active .modal-content {
  transition: transform value.$animation-duration value.$animation-ease;
}

.modal-transition-enter-from .modal-content,
.modal-transition-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
