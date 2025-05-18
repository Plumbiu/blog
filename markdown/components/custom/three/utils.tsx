import type { RefObject } from 'react'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

interface RendererProps {
  width?: number
  height?: number
}

export function buildRenderer(
  ref: RefObject<HTMLDivElement | null>,
  options: RendererProps = {},
) {
  const { width, height } = options
  const container = ref.current!
  const size = container.clientWidth
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearAlpha(0)
  renderer.setSize(width ?? size, height ?? size)
  renderer.pixelRatio = window.devicePixelRatio
  container.appendChild(renderer.domElement)

  return renderer
}

export function buildCamera(x: number, y: number, z: number) {
  const fov = 45
  const aspect = 1
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(x, y, z)
  camera.lookAt(0, 0, 0)
  return camera
}

export function buildGUI(ref: RefObject<HTMLDivElement | null>, width = 250) {
  const gui = new GUI({
    autoPlace: false,
    container: ref.current!,
    width,
  })
  return gui
}
