import {describe, it, vi} from 'vitest'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {mount} from '@vue/test-utils'

import RegisterForm from '@/components/RegisterForm.vue'
import Register from '@/views/Register.vue'

const vuetify = createVuetify({components, directives})
global.ResizeObserver = require('resize-observer-polyfill')

describe('Register', () => {
  const globalMountOptions = {
    global: {
      plugins: [vuetify],
      components: {
        RegisterForm,
      },
      mocks: {
        $router: {
          push: vi.fn(),
        },
      },
      stubs: ['router-link', 'router-view'],
    },
  }

  let wrapper = mount(Register, globalMountOptions)

  it('renders RegisterForm component', () => {
    expect(wrapper.findComponent(RegisterForm).exists()).toBe(true)
  })

  it('initially does not show alert message', () => {
    expect(wrapper.vm.showAlert).toBe(false)
  })

  it('displays the logo image', () => {
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('logo.svg')
  })

  it('triggers alert on register action with error', async () => {
    const mockError = {
      response: {
        data: {message: 'Registration failed'}
      }
    }

    wrapper.vm.createUser = vi.fn().mockRejectedValue(mockError)
    await wrapper.vm.register({})
    expect(wrapper.vm.showAlert).toBe(true)
    expect(wrapper.vm.alertVariant).toBe('error')
    expect(wrapper.vm.alertMsg).toBe('Registration failed')
  })

  it('navigates to dashboard after successful registration', async () => {
    const pushMock = vi.fn()
    const wrapper = mount(Register, {
      global: {
        plugins: [vuetify],
        components: {
          RegisterForm,
        },
        mocks: {
          $router: {
            push: pushMock
          }
        }
      }
    })
    wrapper.vm.createUser = vi.fn().mockResolvedValue({})

    await wrapper.vm.register({})
    expect(pushMock).toHaveBeenCalledWith('/dashboard')
  })

})
