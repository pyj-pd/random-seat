import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Composable for event listening.
 *
 * It will automatically get destroyed after unmounting.
 * @param instance Instance of the event listener.
 * @param type Event type.
 * @param listener Listener function.
 * @param instant Whether to run the listener function instantly after mounting, not after first event listening. Default to `true`.
 */
export const useEventListener = (
  instance: GlobalEventHandlers = window,
  type: string | string[],
  listener: (event?: Event | null) => unknown,
  instant: boolean = true,
) => {
  onMounted(() => {
    if (typeof type === 'string')
      instance.addEventListener(type, listener) // One event type
    else type.forEach((currentType) => instance.addEventListener(currentType, listener)) // Multiple event types

    if (instant) listener(null)
  })

  onBeforeUnmount(() => {
    if (typeof type === 'string')
      instance.removeEventListener(type, listener) // One event type
    else type.forEach((currentType) => instance.removeEventListener(currentType, listener)) // Multiple event types
  })
}
