import { RefObject, useEffect, useRef, useState } from 'react'
import { isFunction } from '@/utils/types'

type VoidFn = () => void

export default function useObserver(
  ref: RefObject<HTMLElement>,
  callback?: () => void | VoidFn,
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const callbackRef = useRef<VoidFn>()
  useEffect(() => {
    const observerDom = ref.current
    // dom is not null, but in dev, run twice will case error
    if (!observerDom) {
      return
    }
    const observer = new IntersectionObserver((entries, self) => {
      const isIntersecting = entries[0].isIntersecting
      if (isIntersecting) {
        setIsIntersecting(true)
        self.unobserve(observerDom)
        const fn = callback?.()
        if (isFunction(fn)) {
          callbackRef.current = fn
        }
      }
    })
    observer.observe(observerDom)
    return () => {
      observer.unobserve(observerDom)
      callbackRef.current?.()
    }
  }, [])

  return isIntersecting
}