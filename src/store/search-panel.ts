'use client'

import { create } from 'zustand'

interface UseSearchPanelStore {
  visible: boolean
  show(): void
  hidden(): void
}

const useSearchPanelStore = create<UseSearchPanelStore>()((set) => ({
  visible: false,
  show() {
    set(() => ({ visible: true }))
  },
  hidden() {
    set(() => ({ visible: false }))
  },
}))

export default useSearchPanelStore
