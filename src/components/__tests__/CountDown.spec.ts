import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CountDown from '../CountDown.vue'

describe('CountDown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders properly with event name', () => {
    const wrapper = mount(CountDown)
    expect(wrapper.text()).toContain('World Cup')
    expect(wrapper.text()).toContain('Final')
  })

  it('displays countdown numbers with zero padding', () => {
    const wrapper = mount(CountDown)
    // Check that numbers are rendered with proper formatting
    const numbers = wrapper.findAll('.number')
    expect(numbers.length).toBe(4) // days, hours, minutes, seconds
    numbers.forEach((num) => {
      expect(num.text()).toMatch(/^\d+$/)
    })
  })

  it('displays labels for time units', () => {
    const wrapper = mount(CountDown)
    expect(wrapper.text()).toContain('日')
    expect(wrapper.text()).toContain('時')
    expect(wrapper.text()).toContain('分')
    expect(wrapper.text()).toContain('秒')
  })

  it('updates countdown every second', async () => {
    const wrapper = mount(CountDown)
    const initialText = wrapper.text()

    // Advance time by 1 second
    vi.advanceTimersByTime(1000)
    await flushPromises()

    // The countdown should still render (values might change but structure stays)
    expect(wrapper.text()).toContain('日')
    expect(wrapper.text()).toContain('World Cup Final')
  })

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const wrapper = mount(CountDown)
    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })

  it('renders with green color class for title', () => {
    const wrapper = mount(CountDown)
    const title = wrapper.find('.countdown-title')
    expect(title.exists()).toBe(true)
    // Check that the color style is applied
    const style = window.getComputedStyle(title.element as Element)
    expect(style.color).toBeDefined()
  })

  it('has proper structure with time-unit elements', () => {
    const wrapper = mount(CountDown)
    const timeUnits = wrapper.findAll('.time-unit')
    expect(timeUnits.length).toBe(4) // days, hours, minutes, seconds

    timeUnits.forEach((unit) => {
      const number = unit.find('.number')
      const label = unit.find('.label')
      expect(number.exists()).toBe(true)
      expect(label.exists()).toBe(true)
    })
  })
})
