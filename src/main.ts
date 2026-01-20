import './styles/base.scss'

import { routes } from './router'
import { createPinia } from 'pinia'

import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { ViteSSG } from 'vite-ssg'
import { createWebHistory } from 'vue-router'

export const createApp = ViteSSG(
  App,
  { routes, history: createWebHistory(import.meta.env.BASE_URL) },
  ({ app }) => {
    // Pinia
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)

    app.use(pinia)
  },
)
