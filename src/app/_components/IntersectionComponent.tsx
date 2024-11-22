import { useRef, useState, useEffect, Suspense, createElement } from 'react'
import Loading from '@/components/_common/Loading'

interface IntersectionCustomComponentProps {
  children: any
  props?: any
}

function IntersectionComponent({
  children,
  props,
}: IntersectionCustomComponentProps) {
  const observerRef = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observerDom = observerRef.current
    // dom is not null, but in dev, run twice will case error
    if (!observerDom) {
      return
    }
    const observer = new IntersectionObserver((entries, self) => {
      const isIntersecting = entries[0].isIntersecting
      if (isIntersecting) {
        setIsIntersecting(true)
        self.unobserve(observerDom)
      }
    })
    observer.observe(observerDom)
    return () => observer.unobserve(observerDom)
  }, [])

  return (
    <div ref={observerRef}>
      <Suspense fallback={<Loading />}>
        {isIntersecting ? createElement(children, props) : null}
      </Suspense>
    </div>
  )
}

export default IntersectionComponent
