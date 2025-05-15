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
import useMounted from './useMounted'

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
    const mounted = useMounted()
    const wrapRectRef = useRef<DOMRect>(null)
    const panelRectRef = useRef<DOMRect>(null)

    function hide() {
      if (mode === 'hover') {
        wrapRectRef.current = null
        panelRectRef.current = null
      }
      setPanelVisible(false)
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

    const show: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
      e.stopPropagation()
      const wrapDom = warpRef.current
      const panelDom = panelRef.current
      if (!wrapDom || !panelDom) {
        return
      }
      if (!wrapRectRef.current) {
        wrapRectRef.current = wrapDom.getBoundingClientRect()
      }
      if (!panelRectRef.current) {
        panelRectRef.current = panelDom.getBoundingClientRect()
      }
      const wrapRect = wrapRectRef.current
      const panelRect = panelRectRef.current
      const panelWidth = panelRect.width
      const viewW = window.innerWidth

      let x = wrapRect.left + wrapRect.width / 2 - panelWidth / 2
      if (x <= 0) {
        x = 12
      } else if (x >= viewW - panelWidth) {
        x = viewW - panelWidth - 12
      }
      panelDom.style.left = x + 'px'
      panelDom.style.top = wrapRect.bottom + (offset?.y || 0) + 'px'
      setPanelVisible(true)
    }, [])

    useEffect(() => {
      mode === 'click' && window.addEventListener('click', handleGlobalClick)
      window.addEventListener('scroll', hide)
      window.addEventListener('resize', hide)
      return () => {
        mode === 'click' &&
          window.removeEventListener('click', handleGlobalClick)
        window.removeEventListener('scroll', hide)
        window.removeEventListener('resize', hide)
      }
    }, [])

    const Tag = tagName
    const triggerProps: HTMLAttributes<HTMLDivElement> = {}

    if (mode === 'click') {
      triggerProps.onClick = show
    } else if (mode === 'hover') {
      triggerProps.onMouseEnter = show
      triggerProps.onMouseLeave = hide
    }

    return (
      <Tag ref={warpRef} className={cn(styles.wrap, className)}>
        <Tag {...triggerProps} className={cn(labelClassName)}>
          {label}
        </Tag>
        {mounted &&
          createPortal(
            <div
              className={cn(styles.panel, panelClassName, {
                [styles.hide]: !panelVisible,
              })}
              ref={panelRef}
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
