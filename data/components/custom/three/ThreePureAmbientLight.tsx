'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { buildCamera, buildGUI, buildRenderer } from './utils'

export default function ThreePureAmbientLight() {
  const ref = useRef(null)

  useEffect(() => {
    const renderer = buildRenderer(ref)
    const camera = buildCamera(10, 10, 10)
    const scene = new THREE.Scene()
    const material = new THREE.MeshPhongMaterial({ color: 0x5080ef })
    const geometry = new THREE.BoxGeometry(4, 4, 4)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)
    const gui = buildGUI(ref)

    gui.add(light, 'intensity', 0, 5, 0.01).onChange(render)
    gui.addColor(light, 'color').onChange(render)

    function render() {
      renderer.render(scene, camera)
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    controls.addEventListener('change', render)

    render()

    return () => {
      controls.removeEventListener('change', render)
    }
  }, [])

  return <div className="fcc" ref={ref} />
}
