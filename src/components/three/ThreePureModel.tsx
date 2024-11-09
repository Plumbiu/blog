import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from 'three/examples/jsm/Addons.js'

function ThreePureModel() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const container = containerRef.current!
    const size = container.clientWidth

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(size, size)
    renderer.pixelRatio = window.devicePixelRatio
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    const camera = new THREE.PerspectiveCamera(45, 1, 0.25, 20)
    camera.position.set(-1.8, 0.6, 2.7)

    function render() {
      renderer.render(scene, camera)
    }

    function renderModal() {
      const loader = new GLTFLoader()
      loader.setPath('/threejs/models/glTF/DamagedHelmet/')
      loader.load(
        'DamagedHelmet.gltf',
        async (gltf) => {
          const model = gltf.scene
          await renderer.compileAsync(model, camera, scene)
          scene.add(model)
          render()
        },
        undefined,
        (error) => {
          console.log(error)
        },
      )
    }

    new RGBELoader().load(
      '/threejs/textures/royal_esplanade_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
        renderModal()
      },
    )

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    controls.update()
  }, [])

  return <div ref={containerRef} />
}

export default ThreePureModel
