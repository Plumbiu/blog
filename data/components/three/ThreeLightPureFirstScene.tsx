import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { buildCamera, buildRenderer } from './utils'

const White = 0xffffff

function LightPureFirstScence() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderer = buildRenderer(containerRef)
    // 设置渲染器渲染阴影
    renderer.shadowMap.enabled = true

    const scene = new THREE.Scene()
    const geometry = new THREE.BoxGeometry(4, 4, 4)
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    material.emissive = new THREE.Color(0x48211a)
    const cube = new THREE.Mesh(geometry, material)
    // 表示 cube 可以投射阴影
    cube.castShadow = true
    // 平面几何
    const planeGeometry = new THREE.PlaneGeometry(20, 20)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: White })
    // 材质的放射光颜色，不受其他光照影响的固有颜色，默认为黑色
    planeMaterial.emissive = new THREE.Color(0x444444)
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    planeMesh.rotation.x = -0.5 * Math.PI
    planeMesh.position.set(0, -6, 0)
    // 接受投射的阴影
    planeMesh.receiveShadow = true
    // 方向光
    const directionalLight = new THREE.DirectionalLight(White, 0.5)
    // 设置方向（根据源点设置）
    directionalLight.position.set(15, 15, 15)
    // 表示该方向会投射阴影效果
    directionalLight.castShadow = true

    scene.add(directionalLight)
    scene.add(planeMesh)
    scene.add(cube)

    function render() {
      renderer.render(scene, camera)
    }
    const axis = new THREE.AxesHelper(5)
    scene.add(axis)
    const camera = buildCamera(15, 15, 15)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    controls.update()
    render()

    return () => {
      controls.removeEventListener('change', render)
    }
  }, [])

  return <div ref={containerRef} />
}

export default LightPureFirstScence
