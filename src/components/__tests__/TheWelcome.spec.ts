import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TheWelcome from '../TheWelcome.vue'

describe('TheWelcome', () => {
  it('renders properly', () => {
    const wrapper = mount(TheWelcome)

    // 驗證關鍵文本內容存在
    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('Tooling')
    expect(wrapper.text()).toContain('Ecosystem')
    expect(wrapper.text()).toContain('Community')
    expect(wrapper.text()).toContain('Support Vue')
  })
})
