import useIsMobileDeviceWithMemo from '@/hooks/useIsMobileDevice'
import { avoidBodyScroll, makeBodyScroll } from '@/store/utils'
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ColumnPhoto } from './columns'
import computeColumnsLayout from './columns'
import type { Photo } from '~/markdown/plugins/remark/directive/gallery-utils'

type DragEvent = TouchEvent | MouseEvent

interface UseMobileDiviceEventProps {
  handleThumbnailClick(index: number): void
  currentIndex: number
}

export function useMobileDiviceEvent({
  handleThumbnailClick,
  currentIndex,
}: UseMobileDiviceEventProps) {
  const isMobile = useIsMobileDeviceWithMemo()
  const isMouseDown = useRef(false)
  const touchXRef = useRef({
    prev: 0,
    curr: 0,
  })

  const drageStart = useCallback((e: DragEvent) => {
    isMouseDown.current = true
    if ('touches' in e) {
      touchXRef.current.prev = e.touches[0].clientX
    } else if ('pageX' in e) {
      touchXRef.current.prev = e.pageX
    }
  }, [])

  const dragMove = useCallback((e: DragEvent) => {
    if ('touches' in e) {
      touchXRef.current.curr = e.touches[0].clientX
    } else if ('pageX' in e && isMouseDown.current) {
      touchXRef.current.curr = e.pageX
    }
  }, [])

  const dragEnd = useCallback(() => {
    const start = touchXRef.current.prev
    const end = touchXRef.current.curr
    if (end - start > 50) {
      handleThumbnailClick(currentIndex - 1)
    } else if (end - start < -50) {
      handleThumbnailClick(currentIndex + 1)
    }
    isMouseDown.current = false
  }, [currentIndex])

  useEffect(() => {
    if (isMobile) {
      window.addEventListener('touchstart', drageStart)
      window.addEventListener('touchmove', dragMove)
      window.addEventListener('touchend', dragEnd)
      return () => {
        window.removeEventListener('touchstart', drageStart)
        window.removeEventListener('touchmove', dragMove)
        window.removeEventListener('touchend', dragEnd!)
      }
    }
  }, [])
}

interface UseBodyScrollEventProps {
  hidden(): void
  slideNode: ReactNode
}

export function useBodyScrollEvent({
  hidden,
  slideNode,
}: UseBodyScrollEventProps) {
  useEffect(() => {
    if (slideNode) {
      avoidBodyScroll(hidden)
    } else {
      makeBodyScroll(hidden)
    }
    return () => {
      makeBodyScroll(hidden)
    }
  }, [slideNode])
}

interface useColumnPhotoProps {
  photos: Photo[]
  ref: RefObject<HTMLElement | null>
  max?: number
}

export function useColumnPhoto({ photos, ref, max }: useColumnPhotoProps) {
  const [columnData, setColumnData] = useState<ColumnPhoto[][]>([])
  function setData() {
    if (!ref.current) {
      return
    }
    const width = ref.current.clientWidth
    const winWidth = window.innerWidth
    const column = winWidth >= 1080 ? 4 : winWidth >= 640 ? 3 : 2
    const data = computeColumnsLayout(
      max ? photos.slice(0, max) : photos,
      8,
      0,
      width,
      column,
    )
    setColumnData(data || [])
  }

  useEffect(() => {
    if (!ref.current) {
      return
    }
    setData()
    const observer = new ResizeObserver(setData)
    observer.observe(ref.current)
    return () => {
      ref.current && observer.unobserve(ref.current)
    }
  }, [])

  return columnData
}
