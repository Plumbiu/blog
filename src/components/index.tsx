'use client'

import dynamic from 'next/dynamic'
import { jsx } from 'react/jsx-runtime'
import { handleComponentName } from '@/plugins/constant'
import Playground from './playground'
import CodeRunner from './code-runner'

const ThreeFirstScene = dynamic(
  () => import('@/components/three/ThreeFirstScene'),
)
const ThreePureFirstScene = dynamic(
  () => import('@/components/three/ThreePureFirstScene'),
)
const ThreeControlPureFirstScene = dynamic(
  () => import('@/components/three/ThreeControlPureFirstScene'),
)
const ThreeLightPureFirstScene = dynamic(
  () => import('@/components/three/ThreeLightPureFirstScene'),
)
const ThreePureLine = dynamic(() => import('@/components/three/ThreePureLine'))
const ThreePureText = dynamic(() => import('@/components/three/ThreePureText'))
const ThreePureModel = dynamic(
  () => import('@/components/three/ThreePureModel'),
)
const ThreeLearnPrimitivesBox = dynamic(
  () => import('@/components/three/ThreeLearnPrimitivesBox'),
)
const ThreeSunEarthMoon = dynamic(
  () => import('@/components/three/ThreeSunEarthMoon'),
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

function CustomComponent(props: any) {
  const componentName = handleComponentName(props)
  const value = componentMap[componentName]
  if (value) {
    return jsx(value, props)
  }
  return props.children
}

export default CustomComponent
