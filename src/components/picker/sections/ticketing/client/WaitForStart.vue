<script setup lang="ts">
import { useP2P } from '@/composables/useP2P'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const hostPeerId = ref<string | null>(null)

// Peer instances
const { initPeer, peerId, peerInstance } = useP2P()

onMounted(() => {
  hostPeerId.value = route.params.id as string

  initPeer()
})

/**
 * Client's peer instance has been initialized.
 */
watch(peerId, () => {
  if (peerInstance.value === null || hostPeerId.value === null) return

  // Connect to host
  const connectionToHost = peerInstance.value.connect(hostPeerId.value)

  connectionToHost.on('open', () => {
    console.log('connected to host')
    connectionToHost.send('Does this work ?')
  })

  // Listen for host messages
  peerInstance.value.on('connection', (connection) => {
    console.log('123')
    connection.on('data', (data) => {
      console.log(data)
    })
  })
})
</script>

<template>
  <main>wait for start man</main>
</template>
