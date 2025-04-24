'use client'

import {
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './Selector.module.css'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/client'

interface SelectorValueItem {
  value: string
  label: ReactNode
}

interface SelectorProps {
  items: SelectorValueItem[]
  children: ReactNode
  className?: string
  offset?: {
    y?: number
    x?: number
  }
}

function Selector({ items, children, offset, className }: SelectorProps) {
  const warpRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelVisible, setPanelVisible] = useState(false)
  const [position, setPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  function hide() {
    const panelDom = panelRef.current
    if (!panelDom) {
      return
    }
    panelDom.classList.add(styles.close)
    setTimeout(() => {
      panelDom.classList.remove(styles.close)
      setPanelVisible(false)
    }, 400)
  }

  const node = useMemo(() => {
    return items.map(({ value, label }) => <div key={value}>{label}</div>)
  }, [items])

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    const target = e.target as Element
    const wrapDom = warpRef.current
    const panelDom = panelRef.current
    if (!wrapDom || !panelDom) {
      return
    }
    if (!wrapDom.contains(target) && !panelDom.contains(target)) {
      hide()
    }
  }, [])

  const handleTriggerClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation()
      setPanelVisible(true)
      const wrapDom = warpRef.current
      if (!wrapDom) {
        return
      }
      const panelRect = wrapDom.getBoundingClientRect()
      setPosition({
        x: panelRect.left + panelRect.width / 2 + (offset?.x || 0),
        y: panelRect.bottom + (offset?.y || 0),
      })
    },
    [],
  )

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick)
    window.addEventListener('scroll', hide)
    return () => {
      window.removeEventListener('click', handleGlobalClick)
      window.removeEventListener('scroll', hide)
    }
  }, [])
  return (
    <div ref={warpRef} className={cn(styles.wrap, className)}>
      <div onClick={handleTriggerClick}>{children}</div>
      {panelVisible &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            className={styles.panel}
            style={{
              top: position?.y,
              left: position?.x,
            }}
          >
            {node}
          </div>,
          document.body,
        )}
    </div>
  )
}

export default Selector
