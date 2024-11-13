import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { buildCamera, buildGUI, buildRenderer } from './utils'

function ThreeLilGuiFirst() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const renderer = buildRenderer(ref, {
      width: 300,
      height: 300,
    })
    const camera = buildCamera(10, 10, 10)
    const scene = new THREE.Scene()
    const gui = buildGUI(ref)

    const boxGeomerty = new THREE.BoxGeometry(6, 6, 6)
    boxGeomerty.scale(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(boxGeomerty, material)
    scene.add(mesh)

    function render() {
      renderer.render(scene, camera)
    }
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    controls.update()

    gui.add(mesh.scale, 'x', 0, 4, 0.1).name('x').onChange(render)
    gui.add(mesh.scale, 'y', 0, 4, 0.1).name('y').onChange(render)
    gui.add(mesh.scale, 'z', 0, 4, 0.1).name('z').onChange(render)

    render()
    return () => {
      controls.removeEventListener('change', render)
    }
  }, [])

  return <div style={{ display: 'flex' }} ref={ref} />
}

export default ThreeLilGuiFirst
