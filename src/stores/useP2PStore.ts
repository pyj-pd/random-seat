import Peer, { type LogLevel } from 'peerjs'
import { defineStore } from 'pinia'

const PEERJS_DEBUG_LEVEL: LogLevel = import.meta.env.DEV ? 3 : 1

export const useP2PStore = defineStore('p2p', {
  state: () => ({
    peer: null as null | Peer,
    peerId: null as null | string,
  }),
  actions: {
    /**
     * Inits peer instance.
     * @returns `true` if peer instance has been initialized successfully, otherwise `false` if peer instance was already initialized.
     */
    initPeer() {
      if (this.peer === null) {
        this.peer = new Peer(null, {
          debug: PEERJS_DEBUG_LEVEL,
        })

        this.peer.once('open', (id) => {
          this.peerId = id

          console.log('Successfully initialized PeerJS instance. Id:', id)
        })
        this.peer.once('close', () => (this.peerId = null))

        return true
      } else return false
    },
  },
})
