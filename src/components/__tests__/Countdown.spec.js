import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CountdownComponent from '../Countdown.vue'
import { Countdown } from 'vue3-flip-countdown'

describe('Countdown.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders properly', () => {
    const wrapper = mount(CountdownComponent, {
      global: {
        components: {
          Countdown
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit complete event when countdown ends', async () => {
    // 设置时间为2024年12月31日23:59:59
    const date = new Date(2024, 11, 31, 23, 59, 59)
    vi.setSystemTime(date)
    
    const wrapper = mount(CountdownComponent, {
      global: {
        components: {
          Countdown
        }
      }
    })
    
    // 等待组件挂载
    await wrapper.vm.$nextTick()
    
    // 推进时间2秒，确保倒计时结束
    await vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    
    // 检查complete事件
    const countdownWrapper = wrapper.findComponent(Countdown)
    expect(countdownWrapper.emitted('complete')).toBeTruthy()
  })
})