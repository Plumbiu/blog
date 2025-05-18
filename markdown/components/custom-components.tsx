'use client'

import { lazy } from 'react'

const ThreePureFirstScene = lazy(
  () => import('./custom/three/ThreePureFirstScene'),
)
const ThreeControlPureFirstScene = lazy(
  () => import('./custom/three/ThreeControlPureFirstScene'),
)
const ThreeLightPureFirstScene = lazy(
  () => import('./custom/three/ThreeLightPureFirstScene'),
)
const ThreePureLine = lazy(() => import('./custom/three/ThreePureLine'))
const ThreePureText = lazy(() => import('./custom/three/ThreePureText'))
const ThreePureModel = lazy(() => import('./custom/three/ThreePureModel'))
const ThreeLearnPrimitivesBox = lazy(
  () => import('./custom/three/ThreeLearnPrimitivesBox'),
)
const ThreeSunEarthMoon = lazy(() => import('./custom/three/ThreeSunEarthMoon'))
const ThreeMaterialKinds = lazy(() =>
  import('./custom/three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialKinds,
  })),
)
const ThreeMaterialKindsShininess = lazy(() =>
  import('./custom/three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialKindsShininess,
  })),
)
const ThreeMaterialToonKind = lazy(() =>
  import('./custom/three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialToonKind,
  })),
)
const ThreeTexture = lazy(() =>
  import('./custom/three/ThreeTexture').then((res) => ({
    default: res.ThreeTexture,
  })),
)
const ThreeTextureMulti = lazy(() =>
  import('./custom/three/ThreeTexture').then((res) => ({
    default: res.ThreeTextureMulti,
  })),
)
const ThreeLilGuiFirst = lazy(() => import('./custom/three/ThreeLilGuiFirst'))
const ThreePureAmbientLight = lazy(
  () => import('./custom/three/ThreePureAmbientLight'),
)
const ExtensionTest = lazy(() => import('./ExtensionTest'))

export const customComponentMap: Record<string, any> = {
  ThreeLearnPrimitivesBox,
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
  ExtensionTest,
}
