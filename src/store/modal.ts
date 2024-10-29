'use client'

import { createStore } from '@plumbiu/react-store'
import { ReactNode, RefObject } from 'react'
import modalStyle from '@/app/components/Modal.module.css'

function preventBodyScroll(e: WindowEventMap['wheel']) {
  e.preventDefault()
}

const useModalStore = createStore({
  children: null as ReactNode,
  hidden(maskRef: RefObject<HTMLDivElement>) {
    const maskDom = maskRef.current
    if (maskDom) {
      maskDom.classList.add(modalStyle.hide)
      setTimeout(() => {
        document.body.removeEventListener('wheel', preventBodyScroll)
        this.$set({ children: null })
        maskDom.classList.remove(modalStyle.hide)
      }, 150)
    }
  },
  setChildren(children: ReactNode) {
    document.body.addEventListener('wheel', preventBodyScroll, {
      passive: false,
    })
    this.$set({ children })
  },
})

export default useModalStore
