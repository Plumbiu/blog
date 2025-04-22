'use client'

import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './OverlayScrollbar.module.css'

const Spacing = 6 * 2

function OverlayScrollbar() {
  const [mounted, setMounted] = useState(false)
  const handlerRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef<number>(null)
  const prePageYRef = useRef<number>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateScroll = useCallback(() => {
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
  }, [])

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const handlerDom = handlerRef.current!
    offsetRef.current =
      e.clientY - handlerDom.offsetTop - handlerDom.clientHeight / 2
    console.log(handlerDom.clientHeight / 2)
    prePageYRef.current = e.clientY
    handlerDom.classList.add(styles.handler_active)
    document.addEventListener('mousemove', onMouseMove)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
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
  }, [])

  const onMouseUp = useCallback(() => {
    const handlerDom = handlerRef.current!
    offsetRef.current = null
    document.removeEventListener('mousemove', onMouseMove)
    handlerDom.classList.remove(styles.handler_active)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll)
    window.addEventListener('resize', updateScroll)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [mounted])

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
}

export default OverlayScrollbar
