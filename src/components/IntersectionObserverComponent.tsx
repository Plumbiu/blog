'use client'

import { useRef, Suspense, createElement, memo } from 'react'
import Loading from '~/data/components/_common/Loading'
import useObserver from '../hooks/useObservser'

interface IntersectionCustomComponentProps {
  children: any
  className?: string
  props?: any
}

const IntersectionObserverComponent = memo(
  ({ children, props, className }: IntersectionCustomComponentProps) => {
    const observerRef = useRef<HTMLDivElement>(null)
    const isIntersecting = useObserver(observerRef)

    return (
      <div className={className} ref={observerRef}>
        <Suspense fallback={<Loading />}>
          {isIntersecting ? createElement(children, props) : null}
        </Suspense>
      </div>
    )
  },
)

export default IntersectionObserverComponent
