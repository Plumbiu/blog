'use client'

import { lazy } from 'react'

const ThreeFirstScene = lazy(() => import('./three/ThreeFirstScene'))
const ThreePureFirstScene = lazy(() => import('./three/ThreePureFirstScene'))
const ThreeControlPureFirstScene = lazy(
  () => import('./three/ThreeControlPureFirstScene'),
)
const ThreeLightPureFirstScene = lazy(
  () => import('./three/ThreeLightPureFirstScene'),
)
const ThreePureLine = lazy(() => import('./three/ThreePureLine'))
const ThreePureText = lazy(() => import('./three/ThreePureText'))
const ThreePureModel = lazy(() => import('./three/ThreePureModel'))
const ThreeLearnPrimitivesBox = lazy(
  () => import('./three/ThreeLearnPrimitivesBox'),
)
const ThreeSunEarthMoon = lazy(() => import('./three/ThreeSunEarthMoon'))
const ThreeMaterialKinds = lazy(() =>
  import('./three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialKinds,
  })),
)
const ThreeMaterialKindsShininess = lazy(() =>
  import('./three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialKindsShininess,
  })),
)
const ThreeMaterialToonKind = lazy(() =>
  import('./three/ThreeMaterialKinds').then((res) => ({
    default: res.ThreeMaterialToonKind,
  })),
)
const ThreeTexture = lazy(() =>
  import('./three/ThreeTexture').then((res) => ({
    default: res.ThreeTexture,
  })),
)
const ThreeTextureMulti = lazy(() =>
  import('./three/ThreeTexture').then((res) => ({
    default: res.ThreeTextureMulti,
  })),
)
const ThreeLilGuiFirst = lazy(() => import('./three/ThreeLilGuiFirst'))
const ThreePureAmbientLight = lazy(
  () => import('./three/ThreePureAmbientLight'),
)

export const customComponentMap: Record<string, any> = {
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
