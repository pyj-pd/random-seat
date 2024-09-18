import { ROUTE_HASH_PREFIX, sections, type SectionId } from '@/constants/section'

/**
 * Gets section id from hash.
 * @param hash Hash including #.
 * @returns Id of the section matching the hash, or `null` if invalid hash
 */
export const getSectionIdFromHash = (hash: string): SectionId | null => {
  const hashId = hash.substring(ROUTE_HASH_PREFIX.length) // Remove hash(#) and get pure id

  const sectionId: SectionId | null =
    hashId in sections
      ? (hashId as SectionId) // If valid hash
      : null // If invalid hash(couldn't find any section with that hash)

  return sectionId
}
