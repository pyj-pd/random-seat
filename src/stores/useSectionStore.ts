import {
  defaultSectionId,
  sections,
  type PickerType,
  type SectionData,
  type SectionId,
} from '@/constants/section'
import { defineStore } from 'pinia'

type HistoryActions = 'save' | 'no-save' | 'clear-all'

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
     * @param historyAction What to do with history when navigating through sections. `save` means saving as history(as normal), `no-save` is quietly move to the section by not saving as history, `clear-all` means clearing all existing history.
     */
    setCurrentSectionId(sectionId: SectionId, historyAction: HistoryActions = 'save') {
      if (historyAction === 'save')
        // Save navigation history
        this.sectionHistory.push(this.currentSectionId)
      else if (historyAction === 'clear-all') this.sectionHistory = []

      this.currentSectionId = sectionId
    },
    /**
     * Navigate to the last section saved in the navigation history.
     */
    navigateToLastSection() {
      if (this.sectionHistory.length < 1) return

      const lastSectionId = this.sectionHistory[this.sectionHistory.length - 1]

      this.sectionHistory.splice(this.sectionHistory.length - 1, 1) // Remove the last section from the history

      this.setCurrentSectionId(lastSectionId, 'no-save')
    },
  },
})
