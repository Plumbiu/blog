import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

function ControlFirstScence() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!
    const size = container.clientWidth
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.pixelRatio = window.devicePixelRatio
    renderer.setSize(size, size)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const geometry = new THREE.BoxGeometry(4, 4, 4)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    function render() {
      renderer.render(scene, camera)
    }
    const camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 1000)
    camera.position.set(5, 5, 10)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    controls.addEventListener('change', render)
    const axis = new THREE.AxesHelper(5)
    scene.add(axis)
    render()
  }, [])

  return <div ref={containerRef} />
}

export default ControlFirstScence
