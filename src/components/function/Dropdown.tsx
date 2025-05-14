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
    const isFirst = useRef(true)

    function hide() {
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

    const calculate = () => {
      const wrapDom = warpRef.current
      const panelDom = panelRef.current
      if (!wrapDom || !panelDom) {
        return
      }
      const wrapRect = wrapDom.getBoundingClientRect()
      const panelRect = panelDom.getBoundingClientRect()
      const wraplLeft = wrapRect.left
      const offsetX = offset?.x || 0
      const panelWidth = panelRect.width
      const panelRight = panelRect.right
      const panelLeft = panelRect.left
      let x = wrapRect.left + offsetX
      if (panelRight >= window.innerWidth - 32) {
        x = wraplLeft - panelWidth / 2 + offsetX + 32
      } else if (panelLeft <= 32) {
        x = wraplLeft + panelWidth / 2 + offsetX - 32
      }
      panelDom.style.left = x + wrapRect.width / 2 + 'px'
      panelDom.style.top = wrapRect.bottom + (offset?.y || 0) + 'px'
    }

    const show: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
      e.stopPropagation()
      calculate()
      if (isFirst.current) {
        isFirst.current = false
        // calculate twice for first render to get the right panelLeft
        calculate()
      }
      setPanelVisible(true)
    }, [])

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
