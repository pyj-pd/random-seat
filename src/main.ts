import './styles/base.scss'

import { routes } from './router'
import { createPinia } from 'pinia'

import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'
import { createHead } from '@unhead/vue'

const app = createApp(App)

// Router
const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(router)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// Unhead
const head = createHead()
app.use(head)

// Mount
app.mount('#app')
