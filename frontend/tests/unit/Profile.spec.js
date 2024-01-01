import {mount} from '@vue/test-utils'
import ProfileView from '@/views/Profile.vue'

describe('ProfileView', () => {
  it('renders Profile text', () => {
    const wrapper = mount(ProfileView)
    expect(wrapper.text()).toContain('Profile')
  })
})
