import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildRenderer } from './utils'

function ThreeSunEarthMoon() {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const renderer = buildRenderer(containerRef)
    const radius = 1
    const widthSegments = 6
    const heightSegments = 6

    const camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 20, 0)
    camera.up.set(0, 0, 1)
    camera.lookAt(0, 0, 0)
    // 参数：https://threejs.org/manual/#zh/primitives#Diagram-SphereGeometry
    const sphereGeometry = new THREE.SphereGeometry(
      radius, // 球体半径,
      widthSegments,
      heightSegments,
    )

    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
    const earthMaterial = new THREE.MeshPhongMaterial({
      emissive: 0x000ff,
      color: 0x2233ff,
    })
    const moonMaterial = new THREE.MeshPhongMaterial({ emissive: 0x888888 })

    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
    sunMesh.scale.set(5, 5, 5)
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
    earthMesh.position.x = 6
    sunMesh.scale.set(2, 2, 2)
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
    moonMesh.position.x = 4.25
    moonMesh.scale.set(0.5, 0.5, 0.5)

    const scene = new THREE.Scene()
    const solarSystem = new THREE.Object3D()
    const earthOrbit = new THREE.Object3D()
    const moonOrbit = new THREE.Object3D()
    const light = new THREE.PointLight(0xffffff, 1500)
    scene.add(light)
    scene.add(solarSystem)
    solarSystem.add(sunMesh)
    solarSystem.add(earthOrbit)

    earthOrbit.add(earthMesh)
    earthOrbit.add(moonOrbit)

    moonOrbit.add(moonMesh)

    const points = [solarSystem, sunMesh, earthOrbit, earthMesh, moonMesh]
    function animate() {
      requestAnimationFrame(animate)
      points.forEach((point) => {
        point.rotation.y += 0.01
      })
      renderer.render(scene, camera)
    }
    const cancelRaf = animate()
    return cancelRaf
  }, [])

  return <div ref={containerRef} />
}

export default ThreeSunEarthMoon
