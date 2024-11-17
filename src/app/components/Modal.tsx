'use client'

import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import useModalStore from '@/store/modal'
import styles from './Modal.module.css'
import { LucideZoomIn, LucideZoomOut } from './Icons'

const Max_Scale_Step = 0.15

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

interface Position {
  x: number
  y: number
}

const initialTranslate: Position = {
  x: 0,
  y: 0,
}

function Modal() {
  const { children, hidden } = useModalStore()
  const maskRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)
  const isMouseDown = useRef(false)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState(initialTranslate)
  const isDoubleClicked = useRef(false)
  const mousePosition = useRef<Position | null>(null)

  function clear() {
    mousePosition.current = null
    isDoubleClicked.current = false
    setScale(1)
    setTranslate(initialTranslate)
  }

  function preventComplexEvent(e: any) {
    e.stopPropagation()
    e.preventDefault()
  }

  function zoom(step: number) {
    const nextScale = scale + step
    if (nextScale < 0) {
      return
    }
    const finalScale = nextScale <= 1 ? 1 : nextScale
    if (finalScale === 1) {
      setTranslate(initialTranslate)
    }
    setScale(finalScale)
    return finalScale
  }

  if (children == null) {
    return null
  }

  return (
    <div>
      <div ref={maskRef} className={styles.mask} />
      <div
        ref={modalRef}
        onClick={(e) => {
          preventComplexEvent(e)
          const target = e.target as HTMLElement
          if (isImage(target) || actionRef.current!.contains(target)) {
            return
          }
          hidden(maskRef)
          clear()
        }}
        className={styles.modal}
        style={{
          transform: `scale(${scale}) translate(${translate.x / scale}px, ${
            translate.y / scale
          }px)`,
        }}
        onWheel={(e) => {
          e.stopPropagation()
          const step = Math.abs(e.deltaY)
          const deltaStep = step > 1 ? Max_Scale_Step : step
          const target = e.target as HTMLImageElement
          if (!isImage(target)) {
            return
          }
          if (e.deltaY < 0) {
            zoom(deltaStep)
          } else if (scale >= 1) {
            zoom(-deltaStep)
          }
        }}
        onMouseDown={(e) => {
          preventComplexEvent(e)
          if (!isImage(e.target as HTMLElement)) {
            return
          }
          isMouseDown.current = true
          mousePosition.current = {
            x: e.clientX - translate.x,
            y: e.clientY - translate.y,
          }
        }}
        onMouseMove={(e) => {
          preventComplexEvent(e)
          const target = e.target as HTMLElement
          if (
            !isMouseDown.current ||
            !mousePosition.current ||
            !isImage(target)
          ) {
            return
          }
          const { clientX, clientY } = e

          const { x, y } = mousePosition.current
          const newTranslate = {
            x: clientX - x,
            y: clientY - y,
          }
          setTranslate(newTranslate)
        }}
        onMouseUp={(e) => {
          const target = e.target as HTMLElement
          preventComplexEvent(e)
          if (!isImage(target) || !mousePosition.current) {
            return
          }
          const imageViewInfo = getImgViewInfo(target, scale)
          if (!imageViewInfo.one) {
            setTranslate(initialTranslate)
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
              const xDistance = clientWidth * scale - window.innerWidth
              const xTranslatedDistance = xDistance - Math.abs(translate.x * 2)
              let one = translate.x < 0 ? -1 : 1
              if (xTranslatedDistance < 0) {
                newTranslate.x = (one * xDistance) / 2
              }
            }
            if (imageViewInfo.hLarge) {
              const yDistance = clientHeight * scale - window.innerHeight
              const yTranslatedDistance = yDistance + Math.abs(translate.y * 2)
              const one = translate.y < 0 ? -1 : 1
              if (yTranslatedDistance > 0) {
                newTranslate.y = (one * yDistance) / 2
              }
            }

            setTranslate(newTranslate)
          }

          isMouseDown.current = false
          mousePosition.current = null
        }}
        onDoubleClick={(e) => {
          preventComplexEvent(e)
          const target = e.target as HTMLElement
          if (isImage(target)) {
            zoom(isDoubleClicked.current ? -0.25 : 0.25)
            isDoubleClicked.current = !isDoubleClicked.current
          }
        }}
      >
        {children}
      </div>
      <div ref={actionRef} className={clsx(styles.action, 'fcc')}>
        <LucideZoomOut onClick={() => zoom(-0.25)} />
        <LucideZoomIn onClick={() => zoom(0.25)} />
      </div>
    </div>
  )
}

export default Modal
