'use client'

import {
  type HTMLAttributes,
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

type TriggerMode = 'click' | 'hover'

export interface DropdownProps {
  children: ReactNode
  mode?: TriggerMode
  label: ReactNode
  className?: string
  panelClassName?: string
  labelClassName?: string
  tagName?: 'div' | 'span'
  offset?: {
    y?: number
    x?: number
  }
}

const Dropdown = memo(
  ({
    children,
    offset,
    className,
    label,
    tagName = 'div',
    panelClassName,
    labelClassName,
    mode = 'click',
  }: DropdownProps) => {
    const warpRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const [panelVisible, setPanelVisible] = useState(false)
    const hideTimerRef = useRef<NodeJS.Timeout>(null)
    const [position, setPosition] = useState<{
      x: number
      y: number
    } | null>(null)

    function hide() {
      const panelDom = panelRef.current
      if (!panelDom) {
        return
      }
      if (hideTimerRef.current) {
        panelDom.classList.remove(styles.close)
        clearTimeout(hideTimerRef.current)
      }
      if (panelVisible === false) {
        return
      }

      panelDom.classList.add(styles.close)
      hideTimerRef.current = setTimeout(() => {
        panelDom.classList.remove(styles.close)
        setPanelVisible(false)
      }, 200)
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
      if (mode === 'hover') {
        return
      }
      window.addEventListener('click', handleGlobalClick)
      window.addEventListener('scroll', hide)
      window.addEventListener('resize', hide)
      return () => {
        window.removeEventListener('click', handleGlobalClick)
        window.removeEventListener('scroll', hide)
        window.removeEventListener('resize', hide)
      }
    }, [])

    const Tag = tagName
    const triggerProps: HTMLAttributes<HTMLDivElement> = {}

    if (mode === 'click') {
      triggerProps.onClick = handleTriggerClick
    } else if (mode === 'hover') {
      triggerProps.onMouseEnter = handleTriggerClick
      triggerProps.onMouseLeave = hide
    }

    return (
      <Tag
        ref={warpRef}
        className={cn(styles.wrap, className)}
        {...triggerProps}
      >
        <Tag className={cn(labelClassName)}>{label}</Tag>
        {panelVisible &&
          position &&
          createPortal(
            <div
              className={cn(styles.panel, panelClassName)}
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
      </Tag>
    )
  },
)

export default Dropdown
