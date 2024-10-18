'use client'

import { createStore } from '@plumbiu/react-store'

const useLogStore = createStore({
  logs: [],
  add(key: string, value: string) {
    const logs = { ...this.logs }
    if (!logs[key]) {
      logs[key] = []
    }
    logs[key].push(value)
    this.$set({ logs })
  },
})

export default useLogStore
