<script setup lang="ts">
import confetti from 'canvas-confetti'
import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue'

const confettiCanvas = useTemplateRef<HTMLCanvasElement>('confetti-canvas')
let confettiInstance: confetti.CreateTypes

onMounted(() => {
  if (confettiCanvas.value === null) return

  // Initialize confetti instance
  confettiInstance = confetti.create(confettiCanvas.value, {})
})

onBeforeUnmount(() => confettiInstance.reset()) // Destroy confetti instance

const resizeCanvas = () => {
  if (confettiCanvas.value === null) return

  confettiCanvas.value.width = window.innerWidth
  confettiCanvas.value.height = window.innerHeight
}

const launchConfetti = () => {
  resizeCanvas()

  confettiInstance({
    scalar: 1.5,
    shapes: ['circle', 'square'],
    spread: 500,
    particleCount: 250,
    origin: {
      x: 0.5,
      y: 0.5,
    },
  })
}

defineExpose({
  launchConfetti,
})
</script>

<template>
  <canvas ref="confetti-canvas" :class="$style['confetti-canvas']"></canvas>
</template>

<style lang="scss" module>
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  width: 100%;
  height: 100%;

  overflow: hidden;

  pointer-events: none;
}
</style>
