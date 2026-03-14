import { toRaw } from 'vue'

export const reversed = <T>(array: T[]): T[] => {
  const newArray = JSON.parse(JSON.stringify(toRaw(array))) as T[]
  return newArray.reverse()
}
