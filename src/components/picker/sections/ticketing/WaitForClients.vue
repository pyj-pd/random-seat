<script lang="ts" setup>
import { useP2PStore } from '@/stores/useP2PStore'
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'

const p2pStore = useP2PStore()
const { initPeer } = p2pStore
const { peer } = storeToRefs(p2pStore)

onBeforeMount(() => {
  initPeer()
  if (peer.value !== null)
    peer.value.on('open', (id) => {
      console.log('Successfully initialized PeerJS instance. Id:', id)
    })
  else console.log('Failed to initialize PeerJS instance.')
})
</script>

<template>
  <main>ssdf</main>
</template>
