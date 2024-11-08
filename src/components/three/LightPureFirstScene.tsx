import { useEffect, useRef } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const White = 0xffffff

function LightPureFirstScence() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!
    const windowAspect = window.innerWidth / window.innerHeight
    const containerWidth = container.clientWidth
    const renderer = new Three.WebGLRenderer({ antialias: true })
    // 设置渲染器渲染阴影
    renderer.shadowMap.enabled = true

    renderer.pixelRatio = window.devicePixelRatio
    renderer.setSize(containerWidth, containerWidth / windowAspect)
    container.appendChild(renderer.domElement)

    const scene = new Three.Scene()
    const geometry = new Three.BoxGeometry(4, 4, 4)
    const material = new Three.MeshStandardMaterial({ color: 0xff0000 })
    const cube = new Three.Mesh(geometry, material)
    cube.castShadow = true

    // 平面几何，可以接受阴影
    const planeGeometry = new Three.PlaneGeometry(20, 20)
    const planeMaterial = new Three.MeshStandardMaterial({ color: White })
    const planeMesh = new Three.Mesh(planeGeometry, planeMaterial)
    planeMesh.rotation.x = -0.5 * Math.PI
    planeMesh.position.set(0, -6, 0)
    // 接受投射的阴影
    planeMesh.receiveShadow = true
    // 方向光
    const directionalLight = new Three.DirectionalLight(White, 0.5)
    // 设置方向（根据源点设置）
    directionalLight.position.set(1, 2, 1)
    // 表示该方向会投射阴影效果
    directionalLight.castShadow = true

    scene.add(directionalLight)
    scene.add(planeMesh)
    scene.add(cube)

    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    const axis = new Three.AxesHelper(5)
    scene.add(axis)
    const camera = new Three.PerspectiveCamera(75, windowAspect, 0.1, 1000)
    camera.position.set(15, 15, 15)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    const cancleFaf = animate()

    return cancleFaf
  }, [])

  return <div ref={containerRef}></div>
}

export default LightPureFirstScence
