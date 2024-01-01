import {createApp} from 'vue'
import {setupVeeValidate} from '../src/plugins/validation'

const app = createApp({})
setupVeeValidate(app)
