import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader, OrbitControls } from 'three/examples/jsm/Addons.js'

function PureText() {
  const conatinerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fontLoadr = new FontLoader()
    fontLoadr.load('/fonts/gentilis_regular.typeface.json', (font) => {
      const container = conatinerRef.current!
      const size = container.clientWidth
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(size, size)
      renderer.pixelRatio = window.devicePixelRatio
      renderer.shadowMap.enabled = true

      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      camera.position.set(0, 0, 10)
      camera.lookAt(0, 0, 0)

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

  return <div ref={conatinerRef} />
}

export default PureText
