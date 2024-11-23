import { RefObject, useEffect, useState } from 'react'

export default function useObserver(
  ref: RefObject<HTMLElement>,
  callback?: () => void,
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

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
        callback?.()
      }
    })
    observer.observe(observerDom)
    return () => observer.unobserve(observerDom)
  }, [])

  return isIntersecting
}
