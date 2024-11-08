'use client'

import dynamic from 'next/dynamic'
import { jsx } from 'react/jsx-runtime'
import { handleComponentName } from '@/plugins/constant'
import Playground from './playground'
import CodeRunner from './code-runner'

const ThreeBasic = dynamic(() => import('@/components/three/ThreeBasic'))
const FirstScene = dynamic(() => import('@/components/three/FirstScene'))
const PureFirstScene = dynamic(
  () => import('@/components/three/PureFirstScene'),
)
const ControlPureFirstScene = dynamic(
  () => import('@/components/three/ControlPureFirstScene'),
)
const LightPureFirstScene = dynamic(
  () => import('@/components/three/LightPureFirstScene'),
)

export const componentMap: Record<string, any> = {
  Playground,
  Run: CodeRunner,
  ThreeBasic,
  FirstScene,
  PureFirstScene,
  ControlPureFirstScene,
  LightPureFirstScene,
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
