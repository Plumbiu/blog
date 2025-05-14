'use client'

import {
  memo,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './Dropdown.module.css'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/client'

export interface DropdownProps {
  children: ReactNode
  label: ReactNode
  className?: string
  offset?: {
    y?: number
    x?: number
  }
}

const Dropdown = memo(
  ({ children, offset, className, label }: DropdownProps) => {
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
        const panelLeft = panelRect.left
        const panelRight = panelRect.right
        const offsetX = offset?.x || 0
        let x = panelRect.left + offsetX
        if (panelRight >= window.innerWidth - 32) {
          x = panelLeft - 16 + offsetX
        } else if (panelLeft <= 32) {
          x = panelLeft + 16 + offsetX
        }
        setPosition({
          x: x + panelRect.width / 2,
          y: panelRect.bottom + (offset?.y || 0),
        })
      },
      [],
    )

    useEffect(() => {
      window.addEventListener('click', handleGlobalClick)
      window.addEventListener('scroll', hide)
      window.addEventListener('resize', hide)
      return () => {
        window.removeEventListener('click', handleGlobalClick)
        window.removeEventListener('scroll', hide)
        window.removeEventListener('resize', hide)
      }
    }, [])
    return (
      <div ref={warpRef} className={cn(styles.wrap, className)}>
        <div onClick={handleTriggerClick}>{label}</div>
        {panelVisible &&
          position &&
          createPortal(
            <div
              className={styles.panel}
              ref={panelRef}
              style={{
                top: position.y,
                left: position.x,
              }}
            >
              {children}
            </div>,
            document.body,
          )}
      </div>
    )
  },
)

export default Dropdown
