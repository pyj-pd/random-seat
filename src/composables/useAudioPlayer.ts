import { onMounted } from 'vue'

type AudioPlayerOptions = {
  volume?: number
}

export const useAudioPlayer = (options?: AudioPlayerOptions) => {
  let audioContext: AudioContext
  let gainNode: GainNode

  /**
   * Initialize audio context for sound effects.
   */
  onMounted(async () => {
    audioContext = new AudioContext()

    gainNode = audioContext.createGain()
    if (typeof options?.volume === 'number') gainNode.gain.value = options.volume
    gainNode.connect(audioContext.destination)
  })

  const loadAudioFile = async (fileUrl: string): Promise<AudioBuffer> => {
    const response = await fetch(fileUrl)
    const audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer())

    return audioBuffer
  }

  /**
   * Play a sound once.
   * @param buffer Audio buffer of the sound.
   * @param options Options for the sound.
   * @param options.playbackRate Playback rate of the sound.
   */
  const playSound = (buffer: AudioBuffer, options?: Partial<{ playbackRate: number }>) => {
    const source = audioContext.createBufferSource()

    source.buffer = buffer
    if (options?.playbackRate) source.playbackRate.value = options.playbackRate
    source.connect(gainNode)
    source.start()
  }

  return {
    loadAudioFile,
    playSound,
  }
}
