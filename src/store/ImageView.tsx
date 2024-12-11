'use client'

import { createStore } from '@plumbiu/react-store'
import React from 'react'

function preventDefault(e: Event) {
  e.preventDefault()
}

export function preventBodyScroll(callback?: () => void) {
  document.body.addEventListener('wheel', preventDefault, {
    passive: false,
  })
  document.body.addEventListener('touchmove', preventDefault, {
    passive: false,
  })
  callback?.()
}

export function makeBodyScroll(callback?: () => void) {
  document.body.removeEventListener('wheel', preventDefault)
  document.body.removeEventListener('touchmove', preventDefault)
  callback?.()
}

const useImageViewlStore = createStore({
  children: null as React.ReactElement | null,
  hidden() {
    makeBodyScroll(() => {
      window.removeEventListener('popstate', this.hidden)
    })
    this.$set({ children: null })
  },
  set(children: React.ReactElement) {
    preventBodyScroll(() => {
      window.addEventListener('popstate', this.hidden)
    })
    this.$set({ children })
  },
})

export default useImageViewlStore
