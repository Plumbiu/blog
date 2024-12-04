'use client'

import { createStore } from '@plumbiu/react-store'
import React, { RefObject } from 'react'

function preventBodyScroll(e: Event) {
  e.preventDefault()
}

const useModalStore = createStore({
  children: null as React.ReactElement | null,
  hidden() {
    window.removeEventListener('popstate', this.hidden)
    document.body.removeEventListener('wheel', preventBodyScroll)
    document.body.removeEventListener('touchmove', preventBodyScroll)
    this.$set({ children: null })
  },
  set(children: React.ReactElement) {
    window.addEventListener('popstate', this.hidden)
    document.body.addEventListener('wheel', preventBodyScroll, {
      passive: false,
    })
    document.body.addEventListener('touchmove', preventBodyScroll, {
      passive: false,
    })
    this.$set({ children })
  },
})

export default useModalStore
