/* eslint-disable @stylistic/function-paren-newline */
'use client'

import { createElement, lazy } from 'react'
import { handleComponentName } from '@/app/posts/_plugins/constant'
import IntersectionComponent from '@/app/_components/IntersectionComponent'
import Playground from './playground'
import CodeRunner from './code-runner'

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

function CustomComponent(props: any) {
  const componentName = handleComponentName(props)
  const value = componentMap[componentName]

  if (value) {
    if (componentName === 'Playground' || componentName === 'Run') {
      return createElement(value, props)
    }
    return <IntersectionComponent props={props}>{value}</IntersectionComponent>
  }
  return props.children
}

export default CustomComponent
