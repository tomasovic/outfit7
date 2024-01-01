import {mount} from '@vue/test-utils'
import {expect, test} from 'vitest'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import HelloWorld from '@/components/HelloWorld.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

test('displays message', () => {
  const wrapper = mount(HelloWorld, {
    global: {
      plugins: [vuetify],
    },
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Events7')
  expect(wrapper.text()).toContain('Login')
  expect(wrapper.text()).toContain('Register')
})
