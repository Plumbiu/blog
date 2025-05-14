'use client'

import { memo, type MouseEventHandler, useEffect, useRef } from 'react'
import styles from './OverlayScrollbar.module.css'
import { throttle } from 'es-toolkit'
import { usePathname } from 'next/navigation'
import useMounted from '../function/useMounted'

const Spacing = 6 * 2

const OverlayScrollbar = memo(() => {
  const mounted = useMounted()
  const handlerRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef<number>(null)
  const pathname = usePathname()

  const updateScroll = () => {
    const handlerDom = handlerRef.current
    if (!handlerDom) {
      return
    }

    const htmlDom = document.documentElement

    const clientHeight = htmlDom.clientHeight - Spacing
    const scrollHeight = htmlDom.scrollHeight
    const scrollTop = htmlDom.scrollTop
    const trackHeight = handlerDom.clientHeight

    const value =
      (scrollTop / (scrollHeight - htmlDom.clientHeight)) *
      (1 - trackHeight / clientHeight) *
      100
    handlerDom.style.top = `${Math.max(0, value)}%`
  }

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const handlerDom = handlerRef.current!
    // remove top, height transition as it will influence calculate
    handlerDom.classList.remove(styles.page_transition)
    handlerDom.classList.add(styles.handler_active)

    offsetRef.current =
      e.clientY - handlerDom.offsetTop - handlerDom.clientHeight / 2
    document.addEventListener('mousemove', onMouseMove)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (offsetRef.current === null) {
      return
    }

    const handlerDom = handlerRef.current!
    const htmlDom = document.documentElement

    const clientHeight = htmlDom.clientHeight - Spacing
    const scrollHeight = htmlDom.scrollHeight
    const trackHeight = handlerDom.clientHeight

    const maxScrollTop = scrollHeight - htmlDom.clientHeight
    const trackAvailable = clientHeight - trackHeight

    if (maxScrollTop <= 0) {
      return
    }
    const newCenterY = e.clientY - offsetRef.current - 6
    let newTop = newCenterY - trackHeight / 2
    newTop = Math.max(0, Math.min(newTop, trackAvailable))
    const scrollTop = (newTop / trackAvailable) * maxScrollTop
    htmlDom.scrollTop = scrollTop
  }

  const onMouseUp = () => {
    const handlerDom = handlerRef.current!
    // add top, height transition when mouse move ended
    handlerDom.classList.add(styles.page_transition)
    handlerDom.classList.remove(styles.handler_active)
    offsetRef.current = null
    document.removeEventListener('mousemove', onMouseMove)
  }

  function updateHandlerHeight() {
    const htmlDom = document.documentElement
    const handlerDom = handlerRef.current!
    // add top, height transition when update scrollbar top
    handlerDom.classList.add(styles.page_transition)
    handlerDom.style.height =
      (htmlDom.clientHeight * htmlDom.clientHeight) / htmlDom.scrollHeight +
      'px'
  }

  useEffect(() => {
    if (!mounted) {
      return
    }
    const resizeEventCallback = throttle(updateScroll, 200)
    window.addEventListener('scroll', updateScroll)
    window.addEventListener('resize', resizeEventCallback)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', resizeEventCallback)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) {
      return
    }
    updateHandlerHeight()
    updateScroll()
  }, [pathname, mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.scroll}>
      <div
        onMouseDown={onMouseDown}
        ref={handlerRef}
        className={styles.handler}
      />
    </div>
  )
})

export default OverlayScrollbar
