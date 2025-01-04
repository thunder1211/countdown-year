import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局配置
config.global.stubs = {
  transition: false,
  'vue3-flip-countdown': true
}