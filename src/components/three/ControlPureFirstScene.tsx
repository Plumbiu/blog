import { useEffect, useRef } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

function ControlFirstScence() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!
    const windowAspect = window.innerWidth / window.innerHeight
    const containerWidth = container.clientWidth
    const renderer = new Three.WebGLRenderer({ antialias: true })
    renderer.pixelRatio = window.devicePixelRatio
    renderer.setSize(containerWidth, containerWidth / windowAspect)
    container.appendChild(renderer.domElement)

    const scene = new Three.Scene()
    const geometry = new Three.BoxGeometry(4, 4, 4)
    const material = new Three.MeshBasicMaterial({ color: 0xff0000 })
    const cube = new Three.Mesh(geometry, material)
    scene.add(cube)
    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    const camera = new Three.PerspectiveCamera(75, windowAspect, 0.1, 1000)
    camera.position.set(5, 5, 10)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    const axis = new Three.AxesHelper(5)
    scene.add(axis)
    const cancleFaf = animate()

    return cancleFaf
  }, [])

  return <div ref={containerRef} />
}

export default ControlFirstScence
