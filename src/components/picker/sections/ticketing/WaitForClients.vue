<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { getPeerClientConnectionUrl } from '@/utils/p2p'
import { convertSvgTextToBase64 } from '@/utils/image'
import { useP2P } from '@/composables/useP2P'

const { initPeer, peerId, peerInstance } = useP2P()

/**
 * QR code data of connection url for clients
 */
const qrCodeData = ref<string | null>(null)

onBeforeMount(() => {
  initPeer()

  if (peerInstance.value === null) {
    console.log('Failed to initialize PeerJS instance.')
    return
  }
})

watch(peerId, async (id) => {
  if (id === null || peerInstance.value === null) return

  // Listen for clients
  peerInstance.value.on('connection', (connection) => {
    console.log('Connected to', connection.peer)
    connection.send('ESJTSEJTGKLSETG')
  })

  // Get connection URL QR code for clients
  const connectionUrl = getPeerClientConnectionUrl(id)

  try {
    const qrCodeRawData = await QRCode.toString(connectionUrl, { type: 'svg' })

    qrCodeData.value = convertSvgTextToBase64(qrCodeRawData)
  } catch (error) {
    console.error(error)
    /** @todo */
  }
})
</script>

<template>
  <main>
    <img v-if="qrCodeData !== null" :src="qrCodeData" :width="300" />
    <input :value="peerId" readonly />
  </main>
</template>
