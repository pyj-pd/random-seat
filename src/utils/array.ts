import { toRaw } from 'vue'

export const safeClone = <T>(array: T[]): T[] => JSON.parse(JSON.stringify(toRaw(array))) as T[]

export const reversed = <T>(array: T[]): T[] => {
  const newArray = [...array]
  return newArray.reverse()
}
