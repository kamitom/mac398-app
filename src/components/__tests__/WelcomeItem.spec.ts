import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WelcomeItem from '../WelcomeItem.vue'

describe('WelcomeItem', () => {
  it('renders heading slot', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        heading: 'Test Heading',
      },
    })

    expect(wrapper.text()).toContain('Test Heading')
  })

  it('renders default slot', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        default: 'Test Content',
      },
    })

    expect(wrapper.text()).toContain('Test Content')
  })

  it('renders icon slot', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        icon: '<span class="test-icon">🎯</span>',
      },
    })

    expect(wrapper.find('.test-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('🎯')
  })

  it('renders all slots together', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        icon: '<span>📚</span>',
        heading: 'Documentation',
        default: 'Read the docs',
      },
    })

    expect(wrapper.text()).toContain('📚')
    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('Read the docs')
  })
})
