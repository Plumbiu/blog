import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { contain } from 'three/src/extras/TextureUtils.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

function PureText() {
  const conatinerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = conatinerRef.current!
    const size = container.clientWidth
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(size, size)
    renderer.pixelRatio = window.devicePixelRatio
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.set(10, 10, 10)
    camera.lookAt(0, 0, 0)

    const material = new THREE.Material()
    const geometry = new TextGeometry('Hello Three.js')
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer.render(scene, camera)
  }, [])

  return <div ref={conatinerRef} />
}

export default PureText
