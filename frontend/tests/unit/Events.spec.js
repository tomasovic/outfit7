import {describe, it} from 'vitest'
import {createVuetify} from 'vuetify'
import {mount} from '@vue/test-utils'
import axios from 'axios'
import ResizeObserver from 'resize-observer-polyfill'
import Events from '@/views/Events.vue'


vi.mock('axios')
global.ResizeObserver = ResizeObserver

describe('EventsView', () => {
  let wrapper
  const vuetify = createVuetify()

  beforeEach(() => {
    wrapper = mount(Events, {
      global: {
        plugins: [vuetify]
      },
    })
  })

  it('renders VDataTable component', () => {
    expect(wrapper.find('.employee-list').exists()).toBe(true)
    expect(wrapper.find('.v-data-table').exists()).toBe(true)
  })

  it('handles search input correctly', async () => {
    await wrapper.setData({searchQuery: 'Test Query'})
    expect(wrapper.vm.searchQuery).toBe('Test Query')
  })

  it('fetches data from the server correctly', async () => {
    const responseData = {
      total: 10,
      events: [{id: 1, name: 'Event 1'}, {id: 2, name: 'Event 2'}],
    }
    axios.get.mockResolvedValue({data: responseData})
    await wrapper.vm.fetchData({})
    expect(wrapper.vm.totalItems).toBe(10)
    expect(wrapper.vm.serverItems).toEqual(responseData.events)
  })
})
