'use client'

import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './OverlayScrollbar.module.css'

const Percent = 67

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
    const scrollHeight = htmlDom.scrollHeight
    const clientHeight = htmlDom.clientHeight
    const scrollTop = htmlDom.scrollTop
    const trackHeight = handlerDom.clientHeight
    const value =
      (scrollTop / (scrollHeight - clientHeight)) *
      (1 - trackHeight / clientHeight) *
      100
    handlerDom.style.top = `${Math.max(0, value)}%`
  }, [])

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const handlerDom = handlerRef.current!
    offsetRef.current =
      e.screenY - handlerDom.offsetTop - handlerDom.clientHeight / 2
    console.log(handlerDom.offsetTop - handlerDom.clientHeight / 2)
    prePageYRef.current = e.clientY
    handlerDom.classList.add(styles.handler_active)
    document.addEventListener('mousemove', onMouseMove)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (offsetRef.current == null || prePageYRef.current == null) {
      return
    }
    const htmlDom = document.documentElement
    // FIXME: not correct
    window.scrollTo({
      top:
        (e.pageY - offsetRef.current) *
        (htmlDom.clientHeight / htmlDom.scrollHeight),
    })
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
