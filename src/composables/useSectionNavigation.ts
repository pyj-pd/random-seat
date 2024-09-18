import {
  defaultRouteHash,
  defaultSectionId,
  ROUTE_HASH_PREFIX,
  sectionIds,
  type SectionId,
} from '@/constants/section'
import { useRouter } from 'vue-router'

export const useSectionNavigation = () => {
  const router = useRouter()

  /**
   * Set hash to section id using router.
   * @param sectionId Id of the section to navigate to.
   */
  const setCurrentSectionId = (sectionId: SectionId) => {
    const hash =
      sectionId === defaultSectionId
        ? defaultRouteHash // If default section
        : ROUTE_HASH_PREFIX + sectionId

    router.push({
      hash,
    })
  }

  /**
   * Navigate to section using index.
   * @param sectionIndex Index of the section to navigate to.
   */
  const setCurrentSectionIndex = (sectionIndex: number) => {
    const sectionId = sectionIds[sectionIndex]

    setCurrentSectionId(sectionId)
  }

  return { setCurrentSectionId, setCurrentSectionIndex }
}
