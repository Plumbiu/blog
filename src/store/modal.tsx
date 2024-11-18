'use client'

import { createStore } from '@plumbiu/react-store'
import React, { RefObject } from 'react'
import modalStyle from '@/app/components/Modal.module.css'

function preventBodyScroll(e: Event) {
  e.preventDefault()
}

const useModalStore = createStore({
  children: null as React.ReactElement | null,
  size: {
    w: 0,
    h: 0,
  },
  hidden(maskRef: RefObject<HTMLDivElement>) {
    const maskDom = maskRef.current
    if (maskDom) {
      maskDom.classList.add(modalStyle.hide)
      setTimeout(() => {
        document.body.removeEventListener('wheel', preventBodyScroll)
        document.body.removeEventListener('touchmove', preventBodyScroll)
        this.$set({ children: null })
        maskDom.classList.remove(modalStyle.hide)
      }, 150)
    }
  },
  set(children: React.ReactElement) {
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
