'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { jsx } from 'react/jsx-runtime'
import { handleComponentName } from '@/plugins/constant'
import Playground from './playground'
import CodeRunner from './code-runner'

const ThreeBasic = dynamic(() => import('@/components/three/Basic'), {
  ssr: false,
})

export interface CustomComponentProp {
  [key: string]: any
  defaultnode: ReactNode
}

export const componentMap: Record<string, any> = {
  Playground,
  Run: CodeRunner,
  ThreeBasic,
}

function CustomComponent(props: CustomComponentProp) {
  const componentName = handleComponentName(props)
  const value = componentMap[componentName]
  if (value) {
    return jsx(value, props)
  }
  return props.defaultnode
}

export default CustomComponent
