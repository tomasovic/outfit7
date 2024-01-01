import {registerPlugins} from '@/plugins'

import App from './App.vue'
import axios from 'axios'
import {createApp} from 'vue'

const app = createApp(App)
axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.withCredentials = true

registerPlugins(app)

app.mount('#app')
