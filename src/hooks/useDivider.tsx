import { useRef } from 'react'
import styles from './useDivider.module.css'

function useDivider() {
  const dividerRef = useRef<HTMLDivElement>(null)
  const initX = useRef<number | null>(null)
  return {
    init(previewDom: HTMLElement | null) {
      if (!previewDom) {
        return
      }
      const dividerDom = dividerRef.current
      if (!dividerDom) {
        return
      }
      const onMouseMove = (e: MouseEvent) => {
        if (initX.current == null) {
          return
        }
        const offset = e.clientX - initX.current
        const style = getComputedStyle(previewDom)
        previewDom.style.width = +style.width.replace('px', '') + offset + 'px'
        initX.current = e.clientX
      }
      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault()
        document.body.style.cursor = 'ew-resize'
        initX.current = e.clientX
        dividerDom.classList.add(styles.active)
        document.addEventListener('mousemove', onMouseMove)
      }
      const onMouseUp = () => {
        initX.current = null
        document.body.style.cursor = 'auto'
        dividerDom.classList.remove(styles.active)
        document.removeEventListener('mousemove', onMouseMove)
      }

      dividerDom.addEventListener('mousedown', onMouseDown)
      document.addEventListener('mouseup', onMouseUp)
    },
    node: <div ref={dividerRef} className={styles.divider} />,
  }
}

export default useDivider
