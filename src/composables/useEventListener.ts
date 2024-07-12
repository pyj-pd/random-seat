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
  type: string,
  listener: (event?: Event | null) => unknown,
  instant: boolean = true,
) => {
  onMounted(() => {
    instance.addEventListener(type, listener)

    if (instant) listener(null)
  })

  onBeforeUnmount(() => instance.removeEventListener(type, listener))
}
