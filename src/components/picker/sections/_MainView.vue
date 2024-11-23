<script setup lang="ts">
import ShadowButton from '@/components/common/ShadowButton.vue'
import ButtonContainer from '@/components/common/ButtonContainer.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getMathRandomValue } from '@/utils/random'
import { MAX_SEAT_ROW_SIZE, MAX_SEAT_COLUMN_SIZE } from '@/constants/seat'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import { GITHUB_REPO_URL, SITE_NAME } from '@/constants/project'
import TextLink from '@/components/common/TextLink.vue'

const { setCurrentSectionId } = useSectionNavigation()

// Seat animation
const SEAT_ROW_NUMBER = 2,
  SEAT_COLUMN_NUMBER = 3

const SEAT_SHAPE_INTERVAL = 1000,
  seatShapeTypes = ['circle', 'triangle', 'rectangle'] as const satisfies string[]

type SeatShape = (typeof seatShapeTypes)[number]

const seatShapes = ref<SeatShape[][]>([]),
  seatShapeInterval = ref<number | null>(null)

const setRandomSeatShapes = () => {
  const newShapes: SeatShape[][] = []

  for (let row = 0; row < SEAT_ROW_NUMBER; row++) {
    const rowShape: SeatShape[] = []

    for (let column = 0; column < SEAT_COLUMN_NUMBER; column++) {
      const randomIndex = Math.floor(getMathRandomValue() * seatShapeTypes.length)

      rowShape.push(seatShapeTypes[randomIndex])
    }

    newShapes.push(rowShape)
  }

  seatShapes.value = [...newShapes]
}

onMounted(() => {
  setRandomSeatShapes()
  seatShapeInterval.value = setInterval(() => setRandomSeatShapes(), SEAT_SHAPE_INTERVAL)
})

onBeforeUnmount(
  () => typeof seatShapeInterval.value === 'number' && clearInterval(seatShapeInterval.value),
)
</script>

<template>
  <main :class="$style.container">
    <div :class="$style['title-container']">
      <h1 :class="$style.title">{{ SITE_NAME }}</h1>
      <p>자리 배치를 바꾸실 예정이신가요?</p>
      <p>
        간편한 설정으로 손쉽게 최대 {{ `${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE}` }} 크기의
        자리를 뽑아보세요.
      </p>
      <p>
        이 프로그램은 오픈소스 프로그램입니다.
        <TextLink :href="GITHUB_REPO_URL">GitHub 레포지토리</TextLink>도 둘러보세요!
      </p>
    </div>
    <div :class="$style['seat-container']">
      <div v-for="(row, rowIndex) in seatShapes" :key="rowIndex" :class="$style['seat-row']">
        <span
          v-for="(seat, columnIndex) in row"
          :key="`${rowIndex},${columnIndex}`"
          :class="seat"
        />
      </div>
    </div>
    <ButtonContainer :responsive="false" :class="$style['button-container']">
      <ShadowButton @click="() => setCurrentSectionId('size-settings')">시작하기</ShadowButton>
      <!-- @todo find some good spot for github link -->
      <!-- <a
        aria-label="GitHub 레포지토리"
        :href="GITHUB_REPO_URL"
        target="_blank"
        :class="$style['github-link']"
      >
        <GitHubIcon :width="15" />
      </a> -->
    </ButtonContainer>
  </main>
</template>

<style module lang="scss">
@use '@/styles/value' as value;
@use '@/styles/palette' as palette;
@use '@/styles/seat' as seat;

.container {
  display: grid;
  gap: value.$container-gap;
  justify-items: center;
  align-content: center;
}

// Seat
.seat-container {
  display: flex;
  gap: seat.$gap;
  flex-direction: column;

  width: 100%;
  max-width: 400px;
}

.seat-row {
  display: flex;
  gap: seat.$gap;
}

.seat-row > span {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: seat.$background-color;

  border: solid seat.$border-width seat.$border-color;

  width: 100%;
  aspect-ratio: seat.$aspect-ratio;

  &::after {
    content: '';

    display: block;

    width: 15%;
    aspect-ratio: 1 / 1;

    background-color: currentColor;
  }

  &:global(.circle)::after {
    border-radius: 100%;
  }

  &:global(.triangle)::after {
    clip-path: polygon(50% 10%, 100% 90%, 0% 90%);
  }
}

// Title
.title-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  > p {
    font-size: 1rem;
  }
}

.title {
  font-size: 2.2rem;
  letter-spacing: -0.05em;

  animation: title-animation 0.5s value.$ease-out 0.2s 1 both;

  @media screen and (max-width: value.$small-screen-width) {
    font-size: 2rem;
  }
}

@keyframes title-animation {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}

// Button
.button-container {
  align-items: center;
  flex-direction: column;
  gap: value.$container-gap;
}

.github-link {
  display: flex;
}
</style>
