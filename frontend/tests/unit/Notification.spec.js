import {mount} from '@vue/test-utils'
import useAlertStore from '@/store/alert'
import AppNotification from '@/components/Notification.vue'
import {createPinia} from 'pinia'

vi.mock('@/store/alert', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    showAlert: true,
    alertVariant: 'error',
    alertMsg: 'Event deleted successfully',
  }
})

describe('AppNotification', () => {
  let wrapper

  beforeEach(() => {
    const pinia = createPinia()
    const store = useAlertStore(pinia)
    wrapper = mount(AppNotification, {
      global: {
        plugins: [pinia],
      },
    })

    store.showAlert = false
    store.alertVariant
  })

  afterEach(() => {
    useAlertStore.showAlert = false
    useAlertStore.alertVariant = ''
    useAlertStore.alertMsg = ''
  })

  it('does not render v-alert when showAlert is true but alertMsg is empty', async () => {
    useAlertStore.showAlert = true
    useAlertStore.alertMsg = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent({ref: 'notification'}).exists()).toBe(false)
  })

})
