'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Selector.module.css'
import { createPortal } from 'react-dom'

interface SelectorValueItem {
  value: string
  label: ReactNode
}

interface SelectorProps {
  items: SelectorValueItem[]
  children: ReactNode
}

function Selector({ items, children }: SelectorProps) {
  const warpRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelVisible, setPanelVisible] = useState(false)
  const [offset, setOffset] = useState<{
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
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Element
      const wrapDom = warpRef.current
      const panelDom = panelRef.current
      if (!wrapDom || !panelDom) {
        return
      }
      if (!wrapDom.contains(target) && !panelDom.contains(target)) {
        hide()
      }
    }
    window.addEventListener('click', handleClick)
    window.addEventListener('scroll', hide)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', hide)
    }
  }, [])
  return (
    <div ref={warpRef} className={styles.wrap}>
      <div
        onClick={(e) => {
          e.stopPropagation()
          setPanelVisible(true)
          const wrapDom = warpRef.current
          if (!wrapDom) {
            return
          }
          const panelRect = wrapDom.getBoundingClientRect()
          setOffset({
            x: panelRect.left + panelRect.width / 2,
            y: panelRect.bottom,
          })
        }}
      >
        {children}
      </div>
      {panelVisible &&
        offset &&
        createPortal(
          <div
            ref={panelRef}
            className={styles.panel}
            style={{
              top: offset?.y,
              left: offset?.x,
            }}
          >
            {items.map(({ value, label }) => (
              <div key={value}>{label}</div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}

export default Selector
