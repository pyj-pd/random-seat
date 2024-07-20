import './styles/base.scss'

import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'

import App from './App.vue'
import { routes } from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const createApp = ViteSSG(App, { routes }, ({ app }) => {
  // Pinia
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
})
