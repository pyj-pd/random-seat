/**
 * Wait a time before executing next code.
 * @async
 * @param ms Time to wait in miliseconds.
 */
export const waitMs = (ms: number) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), ms)
  })
