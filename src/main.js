import './assets/main.postcss'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// API Setup
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('apiToken')}`

const app = createApp(App)
app.use(Toast, { position: 'top-right' })

app.use(store)
app.use(router)

app.mount('#app')
