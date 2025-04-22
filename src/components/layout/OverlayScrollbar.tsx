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
  const trackRef = useRef<HTMLDivElement>(null)
  const mousePositionY = useRef<number>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateScroll = useCallback(() => {
    const dom = trackRef.current
    if (!dom) {
      return
    }

    const htmlDom = document.documentElement
    const scrollHeight = htmlDom.scrollHeight
    const clientHeight = htmlDom.clientHeight
    const screenHeight = htmlDom.scrollTop
    const value = (screenHeight / (scrollHeight - clientHeight)) * Percent
    dom.style.top = `${Math.max(0, value)}%`
  }, [])

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    console.log('start')
    mousePositionY.current = e.pageY
    document.addEventListener('mousemove', onMouseMove)
  }, [])

  const onMouseMove = useCallback(() => {
    // TODO: scroll move
    // if (!mousePositionY.current) {
    //   return
    // }
    // const htmlDom = document.documentElement
    // window.scrollTo({
    //   top: htmlDom.scrollTop + (e.pageY - mousePositionY.current) / Percent,
    // })
  }, [])

  const onMouseUp = useCallback(() => {
    console.log('done')
    mousePositionY.current = null
    document.removeEventListener('mousemove', onMouseMove)
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
      <div onMouseDown={onMouseDown} ref={trackRef} className={styles.track} />
    </div>
  )
}

export default OverlayScrollbar
