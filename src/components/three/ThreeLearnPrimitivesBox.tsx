import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { buildRenderer } from './utils'

function ThreeLearnPrimitivesBox() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderer = buildRenderer(containerRef)
    renderer.setClearColor(0xffffff, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(10, 10, 10)
    camera.lookAt(0, 0, 0)

    const box = new THREE.BoxGeometry(4, 4, 4)
    const material = new THREE.MeshBasicMaterial({ color: 0x3451b2 })
    const mesh = new THREE.Mesh(box, material)

    // 获取 box 的边界
    const edges = new THREE.EdgesGeometry(box)
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
    })
    const line = new THREE.LineSegments(edges, edgesMaterial)
    mesh.add(line)

    scene.add(mesh)
    function render() {
      renderer.render(scene, camera)
    }

    function animate() {
      requestAnimationFrame(animate)
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
      mesh.rotation.z += 0.01
      render()
    }
    const cancelRaf = animate()

    return cancelRaf
  }, [])

  return <div ref={containerRef} />
}

export default ThreeLearnPrimitivesBox
