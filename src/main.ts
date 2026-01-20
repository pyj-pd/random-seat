import './styles/base.scss'

import { routes } from './router'
import { createPinia } from 'pinia'

import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { ViteSSG } from 'vite-ssg'

export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL }, ({ app }) => {
  // Pinia
  const pinia = createPinia()
  if (!import.meta.env.SSR) pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
})
