'use client'

import { createStore } from '@plumbiu/react-store'
import React, { RefObject } from 'react'
import modalStyle from '../_components/Modal.module.css'

function preventBodyScroll(e: Event) {
  e.preventDefault()
}

let isEventAdded = false

const useModalStore = createStore({
  children: null as React.ReactElement | null,
  hidden(maskRef?: RefObject<HTMLDivElement> | Event) {
    if (maskRef && 'current' in maskRef) {
      const dom = maskRef.current
      if (!dom) {
        return
      }
      dom.classList.add(modalStyle.hide)
      setTimeout(() => {
        document.body.removeEventListener('wheel', preventBodyScroll)
        document.body.removeEventListener('touchmove', preventBodyScroll)
        this.$set({ children: null })
        dom.classList.remove(modalStyle.hide)
      }, 150)
    } else {
      this.$set({ children: null })
    }
  },
  set(children: React.ReactElement) {
    if (!isEventAdded) {
      console.log(123)
      window.addEventListener('popstate', this.hidden)
      isEventAdded = true
    }
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
