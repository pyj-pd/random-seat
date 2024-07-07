import './styles/base.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createHead } from 'unhead'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// Router
app.use(router)

// Mount
app.mount('#app')

// Unhead(for tab title)
createHead()
