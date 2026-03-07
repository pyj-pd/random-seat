/**
 * Initial delay between each shuffle in milliseconds.
 */
export const DEFAULT_SHUFFLE_DELAY_MS = 50,
  /**
   * Wait this times until the delay actually starts to get increased.
   */
  SHUFFLE_DELAY_START_AFTER_NUMBERS = 20,
  /**
   * The factor by which the delay increases after each shuffle.
   */
  SHUFFLE_DELAY_INCREASE = 1.045,
  /**
   * Shuffling will end after reaching this amount of delay(miliseconds).
   */
  SHUFFLE_END_DELAY = 950

export const SHUFFLE_SOUND_VOLUME = 5,
  SHUFFLE_SOUND_PLAYBACK_RATE = 3,
  SHUFFLE_DONE_SOUND_PLAYBACK_RATE = 1.5

export const ROULETTE_AUDIO_LOCATION = `${import.meta.env.BASE_URL}sounds/roulette.mp3`,
  ROULETTE_DONE_AUDIO_LOCATION = `${import.meta.env.BASE_URL}sounds/roulette-done.mp3`
