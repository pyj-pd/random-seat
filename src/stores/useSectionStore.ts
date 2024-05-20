import { defaultSectionId, sections, type SectionData, type SectionId } from '@/constants/section'
import { defineStore } from 'pinia'

export const useSectionStore = defineStore('section', {
  state: () => ({
    currentSectionId: defaultSectionId as SectionId,
    lastSectionId: null as SectionId | null,
  }),
  getters: {
    currentSectionData: (state) => sections[state.currentSectionId] as SectionData,
  },
  actions: {
    setCurrentSectionId(sectionId: SectionId) {
      this.lastSectionId = this.currentSectionId // Save navigation history
      this.currentSectionId = sectionId
    },
  },
})
