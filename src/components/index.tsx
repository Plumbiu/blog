'use client'

import { createElement, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Playground from './playground'
import CodeRunner from './code-runner'

const ThreeBasic = dynamic(() => import('@/components/three/Basic'))

export interface CustomComponentProp {
  [key: string]: any
  component: string
  defaultnode: ReactNode
}

export const ComponentMap: Record<string, any> = {
  Playground,
  Run: CodeRunner,
  ThreeBasic,
}

function CustomComponent(props: CustomComponentProp) {
  const value = ComponentMap[props.component]
  if (value) {
    return <div>{createElement(value, props)}</div>
  }
  return <div>{props.defaultnode}</div>
}

export default CustomComponent
