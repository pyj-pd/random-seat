import {
  defaultRouteHash,
  defaultSectionId,
  sectionIds,
  sections,
  type PickerType,
  type SectionData,
  type SectionId,
} from '@/constants/section'
import { getSectionIdFromHash } from '@/utils/section'
import { defineStore } from 'pinia'

export const useSectionStore = defineStore('section', {
  state: () => ({
    pickerType: undefined as PickerType | undefined,
    /**
     * Current hash. Should be only modified by `router` from `PickerVue` component.
     */
    _currentRouteHash: defaultRouteHash as string,
  }),
  getters: {
    currentSectionId(state): SectionId {
      return getSectionIdFromHash(state._currentRouteHash) ?? defaultSectionId
    },
    currentSectionIndex(): number {
      const index = sectionIds.indexOf(this.currentSectionId)

      return index
    },
    currentSectionData(): SectionData {
      return sections[this.currentSectionId]
    },
  },
})
