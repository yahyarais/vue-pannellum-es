import { createApp } from 'vue'
import VuePannellum from '../src/vue-pannellum-es.vue'
import App from './app.vue'

const app = createApp(App)
app.component('VPannellum', VuePannellum)
app.mount('#app')
