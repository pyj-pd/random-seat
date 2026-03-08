import { toRaw } from 'vue'

export const reversed = <T>(array: T[]): T[] => {
  const newArray = structuredClone(toRaw(array))
  return newArray.reverse()
}
