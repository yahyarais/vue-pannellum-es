import { createApp } from 'vue'
import VuePannellum from '../dist/vue-pannellum-es.es'
import App from './app.vue'

import '../dist/vue-pannellum-es.css'

const app = createApp(App)
app.component('VPannellum', VuePannellum)
app.mount('#app')
