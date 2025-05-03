import { type RefObject, useEffect, useRef, useState } from 'react'
import { isFunction } from '@/lib/types'

type VoidFn = () => void

export default function useObserver(
  ref: RefObject<HTMLElement | null>,
  callback?: () => undefined | VoidFn,
) {
  const [isIntersecting, setIsIntersecting] = useState(
    process.env.NODE_ENV === 'test',
  )
  const callbackRef = useRef<VoidFn>(null)
  useEffect(() => {
    const observerDom = ref.current
    // dom is not null, but in dev, run twice will case error
    if (!observerDom) {
      return
    }
    const excauteCallback = () => {
      const fn = callback?.()
      if (isFunction(fn)) {
        callbackRef.current = fn
      }
    }
    if (process.env.NODE_ENV === 'test') {
      excauteCallback()
      return () => {
        callbackRef.current?.()
      }
    }
    const observer = new IntersectionObserver((entries, self) => {
      const isIntersecting = entries[0].isIntersecting
      if (isIntersecting) {
        setIsIntersecting(true)
        self.unobserve(observerDom)
        excauteCallback()
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
