import { defaultSectionId, sections, type PickerType, type SectionData, type SectionId } from '@/constants/section'
import { defineStore } from 'pinia'

export const useSectionStore = defineStore('section', {
  state: () => ({
    pickerType: undefined as PickerType | undefined,
    currentSectionId: defaultSectionId as SectionId,
    sectionHistory: [] as SectionId[],
  }),
  getters: {
    currentSectionData: (state) => sections[state.currentSectionId] as SectionData,
  },
  actions: {
    /**
     * Set section id, and add the section id to navigation history.
     * @param sectionId Section id to set to.
     * @param history Whether to save into the navigation history.
     */
    setCurrentSectionId(sectionId: SectionId, history: boolean = true) {
      if (history)
        // Save navigation history
        this.sectionHistory.push(this.currentSectionId)

      this.currentSectionId = sectionId
    },
    /**
     * Navigate to the last section saved in the navigation history.
     */
    navigateToLastSection() {
      if (this.sectionHistory.length < 1) return

      const lastSectionId = this.sectionHistory[this.sectionHistory.length - 1]

      this.sectionHistory.splice(this.sectionHistory.length - 1, 1) // Remove the last section from the history

      this.setCurrentSectionId(lastSectionId, false)
    },
  },
})
