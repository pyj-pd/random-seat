import { onBeforeUnmount, onMounted } from 'vue'

export const useEventListener = (
  instance: GlobalEventHandlers = window,
  type: string,
  listener: EventListener,
) => {
  onMounted(() => instance.addEventListener(type, listener))

  onBeforeUnmount(() => instance.removeEventListener(type, listener))
}
