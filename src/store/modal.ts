'use client'

import { create } from 'zustand'
import type React from 'react'
import { makeBodyScroll, avoidBodyScroll } from './utils'

interface UseModalStore {
  children: React.ReactElement | null
  hidden(): void
  set(children: React.ReactElement): void
}

const useModalStore = create<UseModalStore>()((set) => ({
  children: null as React.ReactElement | null,
  hidden() {
    set((state) => {
      makeBodyScroll(state.hidden)
      return { children: null }
    })
  },
  set(children) {
    set((state) => {
      avoidBodyScroll(state.hidden)
      return { children }
    })
  },
}))

export default useModalStore
