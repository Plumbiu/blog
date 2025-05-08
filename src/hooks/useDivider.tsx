import { useEffect, useRef } from 'react'
import styles from './useDivider.module.css'
import { throttle } from 'es-toolkit'

function useDivider() {
  const dividerRef = useRef<HTMLDivElement>(null)
  const initValue = useRef<number | null>(null)
  const isMobileRef = useRef<Boolean>(null)
  useEffect(() => {
    isMobileRef.current = window.innerWidth <= 960
  }, [])
  return {
    init(previewDom: HTMLElement | null) {
      if (!previewDom) {
        return
      }
      const dividerDom = dividerRef.current
      if (!dividerDom) {
        return
      }
      const isMobileFn = () => isMobileRef.current

      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault()
        const isMobile = isMobileFn()
        document.body.style.cursor = isMobile ? 'ns-resize' : 'ew-resize'
        initValue.current = isMobile ? e.clientY : e.clientX
        dividerDom.classList.add(styles.active)
        document.addEventListener('mousemove', onMouseMove)
      }
      const onMouseMove = (e: MouseEvent) => {
        if (initValue.current == null) {
          return
        }
        const isMobile = isMobileFn()
        const clientOffset = isMobile ? e.clientY : e.clientX
        const offset = clientOffset - initValue.current
        const style = getComputedStyle(previewDom)

        const changeKey = isMobile ? 'height' : 'width'
        previewDom.style[changeKey] =
          Number.parseFloat(style[changeKey]) + offset + 'px'
        initValue.current = clientOffset
      }
      const onMouseUp = () => {
        initValue.current = null
        document.body.style.cursor = 'auto'
        dividerDom.classList.remove(styles.active)
        document.removeEventListener('mousemove', onMouseMove)
      }
      const onSizeChange = throttle(() => {
        if (window.innerWidth <= 960) {
          isMobileRef.current = true
          previewDom.style.width = 'auto'
        } else {
          isMobileRef.current = false
          previewDom.style.height = 'auto'
        }
      }, 200)

      dividerDom.addEventListener('mousedown', onMouseDown)
      document.addEventListener('mouseup', onMouseUp)
      window.addEventListener('resize', onSizeChange)

      return () => {
        dividerDom.removeEventListener('mousedown', onMouseDown)
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onSizeChange)
      }
    },
    node: <div ref={dividerRef} className={styles.divider} />,
  }
}

export default useDivider
