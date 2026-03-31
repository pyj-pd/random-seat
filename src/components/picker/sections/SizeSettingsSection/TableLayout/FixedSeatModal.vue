<script setup lang="ts">
import NormalButton from '@/components/common/NormalButton.vue'
import { useSeatDataStore } from '@/stores/useSeatSizeStore'
import { storeToRefs } from 'pinia'

const { totalSeatNumber, fixedNumbers, nameData } = storeToRefs(useSeatDataStore())
</script>

<template>
  <div :class="$style.container">
    <div :class="$style['content-container']">
      <h3>고정할 번호를 선택해 주세요.</h3>
      <div :class="$style['select-container']">
        <NormalButton
          v-for="seatNumber of totalSeatNumber"
          :key="seatNumber"
          :class="$style['select-button']"
          :disabled="fixedNumbers.includes(seatNumber)"
        >
          <div>{{ seatNumber }}번</div>
          <div>{{ nameData[seatNumber] || '' }}</div>
        </NormalButton>
      </div>
    </div>
  </div>
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

  background-color: rgba(palette.$black, 0.6);
}

.content-container {
  display: flex;
  gap: value.$button-container-gap;
  flex-direction: column;

  background-color: palette.$white;
  color: palette.$black;

  padding: value.$mini-section-padding;

  width: 100%;
  max-width: 300px;
  height: 100%;
  max-height: 500px;
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
