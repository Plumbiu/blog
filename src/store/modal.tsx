'use client'

import { createStore } from '@plumbiu/react-store'
import type React from 'react'
import { makeBodyScroll, avoidBodyScroll } from './utils'

const useModalStore = createStore({
  children: null as React.ReactElement | null,
  hidden() {
    makeBodyScroll(this.hidden)
    this.$set({ children: null })
  },
  set(children: React.ReactElement) {
    avoidBodyScroll(this.hidden)
    this.$set({ children })
  },
})

export default useModalStore
