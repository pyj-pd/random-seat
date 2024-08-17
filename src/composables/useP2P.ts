import { useP2PStore } from '@/stores/useP2PStore'
import { storeToRefs } from 'pinia'

export const useP2P = () => {
  const p2pStore = useP2PStore()
  const { initPeer } = p2pStore
  const { peer: peerInstance, peerId } = storeToRefs(p2pStore)

  return { initPeer, peerInstance, peerId }
}
