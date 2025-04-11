'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader, OrbitControls } from 'three/examples/jsm/Addons.js'
import { buildCamera, buildRenderer } from './utils'

function PureText() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fontLoadr = new FontLoader()
    fontLoadr.load('/threejs/fonts/gentilis_regular.typeface.json', (font) => {
      const renderer = buildRenderer(containerRef)
      const scene = new THREE.Scene()
      const camera = buildCamera(0, 0, 10)

      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
      })
      material.emissive = new THREE.Color(0x48211a)

      const geometry = new TextGeometry('Hello', {
        font,
        size: 24,
        depth: 24,
      })
      const light = new THREE.DirectionalLight(0xffffff, 0.4)
      light.position.set(1, 1, 1)
      light.castShadow = true

      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true

      scene.add(mesh)
      scene.add(light)
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.update()

      renderer.render(scene, camera)
      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
      }
      const cancelRaf = animate()
      return cancelRaf
    })
  }, [])

  return <div ref={containerRef} />
}

export default PureText
