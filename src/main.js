import './assets/main.postcss'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(Toast, { position: 'top-right' })

app.use(store)
app.use(router)

app.mount('#app')
