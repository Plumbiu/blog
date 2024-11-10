import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function FirstScence() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!
    const size = container.clientWidth
    // 1. 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    // 设置背景色透明
    renderer.setClearAlpha(0)
    // 指定设备像素密度
    renderer.pixelRatio = window.devicePixelRatio
    // 设置大小
    renderer.setSize(size, size)
    // 将渲染器的 dom 节点加入 container 下
    container.appendChild(renderer.domElement)

    // 2. 创建场景
    const scene = new THREE.Scene()
    // 2.1 创建几何体
    const geometry = new THREE.BoxGeometry(4, 4, 4)
    // 2.2 创建材质
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    // 2.3 集合体和材质组合成 Mesh 对象
    const cube = new THREE.Mesh(geometry, material)
    // 2.4 将 Mesh 对象添加到场景中
    scene.add(cube)
    // 2.5 旋转动画
    function animate() {
      requestAnimationFrame(animate)
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    // 3. 创建相机
    const camera = new THREE.PerspectiveCamera(
      75, // fov
      1 / 1, // aspect
      0.1, // near
      1000, // far
    )
    // 设置相机的位置 (x, y, z) = (5, 5, 10)
    camera.position.set(5, 5, 10)
    // 设置相机看向原点 0, 0, 0
    camera.lookAt(0, 0, 0)

    // 4. 创建物体
    const axis = new THREE.AxesHelper(5)
    // 添加到场景中
    scene.add(axis)
    // 5. 渲染
    const cancleFaf = animate() // renderer.render(scene, camera)

    return cancleFaf
  }, [])

  return <div ref={containerRef} />
}

export default FirstScence
