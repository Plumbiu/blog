/* eslint-disable @stylistic/function-paren-newline */
'use client'

import {
  createElement,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react'
import { handleComponentName } from '@/app/posts/_plugins/constant'
import Playground from './playground'
import CodeRunner from './code-runner'
import Loading from './_common/Loading'

const ThreeFirstScene = lazy(() => import('@/components/three/ThreeFirstScene'))
const ThreePureFirstScene = lazy(
  () => import('@/components/three/ThreePureFirstScene'),
)
const ThreeControlPureFirstScene = lazy(
  () => import('@/components/three/ThreeControlPureFirstScene'),
)
const ThreeLightPureFirstScene = lazy(
  () => import('@/components/three/ThreeLightPureFirstScene'),
)
const ThreePureLine = lazy(() => import('@/components/three/ThreePureLine'))
const ThreePureText = lazy(() => import('@/components/three/ThreePureText'))
const ThreePureModel = lazy(() => import('@/components/three/ThreePureModel'))
const ThreeLearnPrimitivesBox = lazy(
  () => import('@/components/three/ThreeLearnPrimitivesBox'),
)
const ThreeSunEarthMoon = lazy(
  () => import('@/components/three/ThreeSunEarthMoon'),
)
const ThreeMaterialKinds = lazy(() =>
  import('@/components/three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialKinds,
  })),
)
const ThreeMaterialKindsShininess = lazy(() =>
  import('@/components/three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialKindsShininess,
  })),
)
const ThreeMaterialToonKind = lazy(() =>
  import('@/components/three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialToonKind,
  })),
)
const ThreeTexture = lazy(() =>
  import('@/components/three/ThreeTexture').then((res) => ({
    default: res.ThreeTexture,
  })),
)
const ThreeTextureMulti = lazy(() =>
  import('@/components/three/ThreeTexture').then((res) => ({
    default: res.ThreeTextureMulti,
  })),
)
const ThreeLilGuiFirst = lazy(
  () => import('@/components/three/ThreeLilGuiFirst'),
)
const ThreePureAmbientLight = lazy(
  () => import('@/components/three/ThreePureAmbientLight'),
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
      <Suspense fallback={<Loading />}>
        {isIntersecting ? createElement(value, props) : null}
      </Suspense>
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
