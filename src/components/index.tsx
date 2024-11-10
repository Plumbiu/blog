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
    const observerDom = observerRef.current!
    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0].isIntersecting)
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
