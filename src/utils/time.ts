/**
 * Wait a time before executing next code.
 * @async
 * @param ms Time to wait in miliseconds.
 */
export const waitMs = (ms: number) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), ms)
  })
