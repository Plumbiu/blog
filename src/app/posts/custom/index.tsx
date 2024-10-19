'use client'

import { createElement, ReactNode } from 'react'
import Playground from './Playground'

// const Playground = dynamic(() => import('./Playground'), {
//   loading: () => <Loading />,
// })

export interface CustomComponentProp {
  [key: string]: any
  component: string
  defaultnode: ReactNode
}

const ComponentMap: Record<string, any> = {
  Playground,
}

function CustomComponent(props: CustomComponentProp) {
  const value = ComponentMap[props.component]
  if (value) {
    return <div>{createElement(value, props)}</div>
  }
  return <div>{props.defaultnode}</div>
}

export default CustomComponent
