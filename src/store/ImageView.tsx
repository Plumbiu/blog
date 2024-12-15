'use client'

import { createStore } from '@plumbiu/react-store'
import type React from 'react'

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
  callback && window.addEventListener('popstate', callback)
}

export function makeBodyScroll(callback?: () => void) {
  document.body.removeEventListener('wheel', preventDefault)
  document.body.removeEventListener('touchmove', preventDefault)
  callback && window.removeEventListener('popstate', callback)
}

const useImageViewlStore = createStore({
  children: null as React.ReactElement | null,
  hidden() {
    makeBodyScroll(this.hidden)
    this.$set({ children: null })
  },
  set(children: React.ReactElement) {
    preventBodyScroll(this.hidden)
    this.$set({ children })
  },
})

export default useImageViewlStore
