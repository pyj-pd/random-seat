import Peer from 'peerjs'
import { defineStore } from 'pinia'

export const useP2PStore = defineStore('p2p', {
  state: () => ({
    peer: null as null | Peer,
  }),
  actions: {
    /**
     * Inits peer instance.
     * @returns `true` if peer instance has been initialized successfully, otherwise `false` if peer instance was already initialized.
     */
    initPeer() {
      if (this.peer === null) {
        this.peer = new Peer()
        return true
      } else return false
    },
  },
})
