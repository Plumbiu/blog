import { type RefObject } from 'react'
import * as THREE from 'three'

export function buildRenderer(ref: RefObject<HTMLDivElement>) {
  const container = ref.current!
  const size = container.clientWidth
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(size, size)
  renderer.pixelRatio = window.devicePixelRatio
  container.appendChild(renderer.domElement)

  return renderer
}
