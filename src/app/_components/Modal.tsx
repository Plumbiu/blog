'use client'

import { MouseEventHandler, useRef, WheelEventHandler } from 'react'
import { cn } from '@/utils/client'
import useModalStore from '@/app/_store/modal'
import styles from './Modal.module.css'

interface Position {
  x: number
  y: number
}

function isImage(node: HTMLElement) {
  return node.tagName.toLowerCase() === 'img'
}

function getImgViewInfo(node: HTMLElement, scale: number) {
  const w = node.clientWidth * scale
  const h = node.clientHeight * scale
  const viewW = window.innerWidth
  const viewH = window.innerHeight

  const wLarge = w >= viewW
  const hLarge = h >= viewH
  return { all: wLarge && hLarge, one: wLarge || hLarge, wLarge, hLarge }
}

function preventComplexEvent(e: any) {
  e.stopPropagation()
  e.preventDefault()
}

function ImagePreview() {
  const { children, hidden } = useModalStore()
  const modalRef = useRef<HTMLDivElement>(null)
  const scale = useRef(1)
  const preScale = useRef(1)
  const translate = useRef({
    x: 0,
    y: 0,
  })
  const isDoubleClicked = useRef(false)
  const mousePosition = useRef<Position | null>(null)

  function scaleDown() {
    scale.current /= 1.1
  }
  function scaleUp() {
    scale.current *= 1.1
  }

  function updateDOM() {
    if (scale.current < 1) {
      scale.current = 1
      preScale.current = 1
      translate.current = {
        x: 0,
        y: 0,
      }
    }
    // eslint-disable-next-line @stylistic/max-len
    modalRef.current!.style.transform = `matrix(${scale.current},0,0,${scale.current},${translate.current.x},${translate.current.y})`
  }

  function addAnimation() {
    modalRef.current?.classList.add(styles.anim)
  }

  function removeAnimation() {
    modalRef.current?.classList.remove(styles.anim)
  }

  const onWheel: WheelEventHandler<HTMLDivElement> = (e) => {
    removeAnimation()
    e.stopPropagation()
    const target = e.target as HTMLImageElement
    if (!isImage(target)) {
      return
    }
    let nextScale = e.deltaY < 0 ? scale.current * 1.1 : scale.current / 1.1
    if (nextScale < 1) {
      nextScale = 1
    }
    if (nextScale === 1) {
      addAnimation()
    }
    preScale.current = scale.current
    if (e.deltaY < 0) {
      scaleUp()
    } else {
      scaleDown()
    }
    const { x, y, width, height } = target.getBoundingClientRect()
    const { clientX, clientY } = e
    const n = scale.current / preScale.current
    translate.current.x -= (1 - n) * (width / 2 - clientX + x)
    translate.current.y -= (1 - n) * (height / 2 - clientY + y)
    updateDOM()
    addAnimation()
  }

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    preventComplexEvent(e)
    if (!isImage(e.target as HTMLElement)) {
      return
    }
    mousePosition.current = {
      x: e.clientX - translate.current.x,
      y: e.clientY - translate.current.y,
    }
  }

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    preventComplexEvent(e)
    const target = e.target as HTMLElement
    if (!mousePosition.current || !isImage(target)) {
      return
    }
    const { clientX, clientY } = e
    const { x, y } = mousePosition.current
    translate.current = {
      x: clientX - x,
      y: clientY - y,
    }
    updateDOM()
  }

  const onMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    preventComplexEvent(e)
    const target = e.target as HTMLElement
    if (!isImage(target) || !mousePosition.current) {
      return
    }
    const imageViewInfo = getImgViewInfo(target, scale.current)
    if (!imageViewInfo.one) {
      translate.current = {
        x: 0,
        y: 0,
      }
    } else {
      const { clientX, clientY } = e
      const { x, y } = mousePosition.current
      const clientWidth = target.clientWidth
      const clientHeight = target.clientHeight

      const newTranslate = {
        x: clientX - x,
        y: clientY - y,
      }

      if (imageViewInfo.wLarge) {
        const xDistance = clientWidth * scale.current - window.innerWidth
        const xTranslatedDistance =
          xDistance - Math.abs(translate.current.x * 2)
        let one = translate.current.x < 0 ? -1 : 1
        if (xTranslatedDistance < 0) {
          newTranslate.x = (one * xDistance) / 2
        }
      }
      if (imageViewInfo.hLarge) {
        const yDistance = clientHeight * scale.current - window.innerHeight
        const yTranslatedDistance =
          yDistance + Math.abs(translate.current.y * 2)
        const one = translate.current.y < 0 ? -1 : 1
        if (yTranslatedDistance > 0) {
          newTranslate.y = (one * yDistance) / 2
        }
      }
      translate.current = newTranslate
    }
    updateDOM()
    mousePosition.current = null
  }

  if (!children) {
    return
  }

  return (
    <div>
      <div className={styles.mask} />
      <div
        ref={modalRef}
        onClick={(e) => {
          preventComplexEvent(e)
          const target = e.target as HTMLElement
          if (isImage(target)) {
            return
          }
          hidden()
        }}
        className={cn(styles.modal, styles.anim)}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {children}
      </div>
    </div>
  )
}

export default ImagePreview
