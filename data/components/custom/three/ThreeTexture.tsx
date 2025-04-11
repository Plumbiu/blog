'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { buildCamera, buildRenderer } from './utils'

export function ThreeTextureMulti() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const loader = new THREE.TextureLoader()

    function loadTexture(p: string): Promise<THREE.Texture> {
      return new Promise((resolve) => {
        loader.load(p, resolve)
      })
    }
    async function loadMaterials(paths: string[]) {
      const textures = await Promise.all(
        paths.map(async (p) => {
          const texture = await loadTexture(p)
          texture.colorSpace = THREE.SRGBColorSpace
          return texture
        }),
      )
      return textures.map(
        (texture) => new THREE.MeshBasicMaterial({ map: texture }),
      )
    }
    const renderer = buildRenderer(ref)
    const camera = buildCamera(10, 10, 10)
    const scence = new THREE.Scene()
    function render() {
      renderer.render(scence, camera)
    }
    const nums = [1, 2, 3, 4, 5, 6]
    loadMaterials(nums.map((n) => `/images/threejs/flower-${n}.jpg`)).then(
      (materials) => {
        const geometry = new THREE.BoxGeometry(4, 4, 4)
        const box = new THREE.Mesh(geometry, materials)
        scence.add(box)
        render()
      },
    )

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    controls.update()

    return () => {
      controls.removeEventListener('change', render)
    }
  }, [])

  return (
    <div
      style={{
        width: '40%',
      }}
      ref={ref}
    />
  )
}

export function ThreeTexture() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const renderer = buildRenderer(ref)
    const camera = buildCamera(10, 10, 10)
    const scence = new THREE.Scene()
    function render() {
      renderer.render(scence, camera)
    }
    const loader = new THREE.TextureLoader()
    loader.load('/images/threejs/wall.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace

      const material = new THREE.MeshBasicMaterial({
        map: texture,
      })
      const geometry = new THREE.BoxGeometry(4, 4, 4)

      const box = new THREE.Mesh(geometry, material)
      scence.add(box)
      render()
    })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    controls.update()

    return () => {
      controls.removeEventListener('change', render)
    }
  }, [])

  return (
    <div
      style={{
        width: '40%',
      }}
      ref={ref}
    />
  )
}
