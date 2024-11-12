import { DEFAULT_SEAT_NUMBERS_OPTION, OPTIONS_LOCAL_STORAGE_KEY } from '@/constants/options'
import { defineStore } from 'pinia'

export const useOptionStore = defineStore('options', {
  state: () => ({
    showSeatNumbers: DEFAULT_SEAT_NUMBERS_OPTION,

    /**
     * Whether user used the website first time.
     * Used for showing tooltip guides.
     */
    isFirstTime: true,
  }),
  persist: {
    key: OPTIONS_LOCAL_STORAGE_KEY,
  },
})
