export const getCryptoRandomValue = () => {
  const array = new Uint8Array(1)
  crypto.getRandomValues(array)

  const value = array[0] / 2 ** 8

  return value
}

export const getMathRandomValue = () => Math.random()
