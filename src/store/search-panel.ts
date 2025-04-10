'use client'

import { createStore } from '@plumbiu/react-store'
import { avoidBodyScroll, makeBodyScroll } from './utils'

const useSearchPanelStore = createStore({
  visible: false,
  show() {
    avoidBodyScroll(this.hidden)
    this.$set({ visible: true })
  },
  hidden() {
    makeBodyScroll(this.hidden)
    this.$set({ visible: false })
  },
})

export default useSearchPanelStore
