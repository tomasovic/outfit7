import {describe, it, vi} from 'vitest'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {mount} from '@vue/test-utils'
import LoginForm from '@/components/LoginForm.vue'
import Login from '@/views/Login.vue'


const vuetify = createVuetify({components, directives})
global.ResizeObserver = require('resize-observer-polyfill')

describe('LoginView', () => {
  const globalMountOptions = {
    global: {
      plugins: [vuetify],
      components: {
        LoginForm,
      },
      mocks: {
        $router: {
          push: vi.fn(),
        },
      },
      stubs: ['router-link', 'router-view'],
    },
  }

  let wrapper = mount(Login, globalMountOptions)

  it('renders LoginForm component', () => {
    expect(wrapper.findComponent(LoginForm).exists()).toBe(true)
  })

  it('initially does not show alert message', () => {
    expect(wrapper.vm.showAlert).toBe(false)
  })

  it('displays the logo image', () => {
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('logo.svg')
  })

  it('triggers alert on login action with error', async () => {
    const mockError = {
      response: {
        data: {message: 'Login failed'}
      }
    }

    wrapper.vm.authenticate = vi.fn().mockRejectedValue(mockError)
    await wrapper.vm.login({})
    expect(wrapper.vm.showAlert).toBe(true)
    expect(wrapper.vm.alertVariant).toBe('error')
    expect(wrapper.vm.alertMsg).toBe('Login failed')
  })

  it('redirects to dashboard on successful login', async () => {
    wrapper.vm.authenticate = vi.fn().mockResolvedValue(true)
    await wrapper.vm.login({email: 'test@example.com', password: 'password'})
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/dashboard')
  })
})
