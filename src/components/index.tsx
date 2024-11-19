'use client'

import dynamic from 'next/dynamic'
import { createElement, useEffect, useRef, useState } from 'react'
import { handleComponentName } from '@/plugins/constant'
import Playground from './playground'
import CodeRunner from './code-runner'
import Loading from './_common/Loading'

const ThreeFirstScene = dynamic(
  () => import('@/components/three/ThreeFirstScene'),
  {
    loading: () => <Loading />,
  },
)
const ThreePureFirstScene = dynamic(
  () => import('@/components/three/ThreePureFirstScene'),
  {
    loading: () => <Loading />,
  },
)
const ThreeControlPureFirstScene = dynamic(
  () => import('@/components/three/ThreeControlPureFirstScene'),
  {
    loading: () => <Loading />,
  },
)
const ThreeLightPureFirstScene = dynamic(
  () => import('@/components/three/ThreeLightPureFirstScene'),
  {
    loading: () => <Loading />,
  },
)
const ThreePureLine = dynamic(
  () => import('@/components/three/ThreePureLine'),
  {
    loading: () => <Loading />,
  },
)
const ThreePureText = dynamic(
  () => import('@/components/three/ThreePureText'),
  {
    loading: () => <Loading />,
  },
)
const ThreePureModel = dynamic(
  () => import('@/components/three/ThreePureModel'),
  {
    loading: () => <Loading />,
  },
)
const ThreeLearnPrimitivesBox = dynamic(
  () => import('@/components/three/ThreeLearnPrimitivesBox'),
  {
    loading: () => <Loading />,
  },
)
const ThreeSunEarthMoon = dynamic(
  () => import('@/components/three/ThreeSunEarthMoon'),
  {
    loading: () => <Loading />,
  },
)
const ThreeMaterialKinds = dynamic(
  () =>
    import('@/components/three/ThreeMaterialKinds').then(
      (res) => res.ThreeMaterialKinds,
    ),
  {
    loading: () => <Loading />,
  },
)
const ThreeMaterialKindsShininess = dynamic(
  () =>
    import('@/components/three/ThreeMaterialKinds').then(
      (res) => res.ThreeMaterialKindsShininess,
    ),
  {
    loading: () => <Loading />,
  },
)
const ThreeMaterialToonKind = dynamic(
  () =>
    import('@/components/three/ThreeMaterialKinds').then(
      (res) => res.ThreeMaterialToonKind,
    ),
  {
    loading: () => <Loading />,
  },
)
const ThreeTexture = dynamic(
  () =>
    import('@/components/three/ThreeTexture').then((res) => res.ThreeTexture),
  {
    loading: () => <Loading />,
  },
)
const ThreeTextureMulti = dynamic(
  () =>
    import('@/components/three/ThreeTexture').then(
      (res) => res.ThreeTextureMulti,
    ),
  {
    loading: () => <Loading />,
  },
)
const ThreeLilGuiFirst = dynamic(
  () => import('@/components/three/ThreeLilGuiFirst'),
  {
    loading: () => <Loading />,
  },
)
const ThreePureAmbientLight = dynamic(
  () => import('@/components/three/ThreePureAmbientLight'),
  {
    loading: () => <Loading />,
  },
)

export const componentMap: Record<string, any> = {
  Playground,
  Run: CodeRunner,
  // Three.js
  ThreeLearnPrimitivesBox,
  ThreeFirstScene,
  ThreePureFirstScene,
  ThreeControlPureFirstScene,
  ThreeLightPureFirstScene,
  ThreePureLine,
  ThreePureText,
  ThreePureModel,
  ThreeSunEarthMoon,
  ThreeMaterialKinds,
  ThreeMaterialKindsShininess,
  ThreeMaterialToonKind,
  ThreeTexture,
  ThreeTextureMulti,
  ThreeLilGuiFirst,
  ThreePureAmbientLight,
}

interface IntersectionCustomComponentProps {
  value: any
  props: any
}

function IntersectionCustomComponent({
  value,
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
      {isIntersecting ? createElement(value, props) : <Loading />}
    </div>
  )
}

function CustomComponent(props: any) {
  const componentName = handleComponentName(props)
  const value = componentMap[componentName]

  if (value) {
    return <IntersectionCustomComponent value={value} props={props} />
  }
  return props.children
}

export default CustomComponent
