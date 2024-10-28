'use client'

import { createStore } from '@plumbiu/react-store'
import { ReactNode } from 'react'

const useModalStore = createStore({
  children: null as ReactNode,
  hidden() {
    document.documentElement.style.overflowY = 'auto'
    this.$set({ children: null })
  },
  setChildren(children: ReactNode) {
    document.documentElement.style.overflowY = 'hidden'
    this.$set({ children })
  },
})

export default useModalStore
