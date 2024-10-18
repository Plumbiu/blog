'use client'

import { createStore } from '@plumbiu/react-store'
import { ReactNode } from 'react'

const useModalStore = createStore({
  children: null as ReactNode,
  hidden() {
    this.$set({ children: null })
  },
  setChildren(children: ReactNode) {
    this.$set({ children })
  },
})

export default useModalStore
