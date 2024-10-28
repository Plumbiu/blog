'use client'

import { createStore } from '@plumbiu/react-store'
import { ReactNode, RefObject } from 'react'
import modalStyle from '@/app/components/Modal.module.css'

const useModalStore = createStore({
  children: null as ReactNode,
  hidden(maskRef: RefObject<HTMLDivElement>) {
    const maskDom = maskRef.current
    if (maskDom) {
      maskDom.classList.add(modalStyle.hide)
      setTimeout(() => {
        document.body.style.overflowY = 'auto'
        this.$set({ children: null })
        maskDom.classList.remove(modalStyle.hide)
      }, 300)
    }
  },
  setChildren(children: ReactNode) {
    document.body.style.overflowY = 'hidden'
    this.$set({ children })
  },
})

export default useModalStore
