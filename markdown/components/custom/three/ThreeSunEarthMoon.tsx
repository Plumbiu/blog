import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildCamera, buildRenderer } from './utils'

function ThreeSunEarthMoon() {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const renderer = buildRenderer(containerRef)

    const camera = buildCamera(0, 35, 0)
    // 参数：https://threejs.org/manual/#zh/primitives#Diagram-SphereGeometry
    const sphereGeometry = new THREE.SphereGeometry(1, 6, 6)

    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
    const earthMaterial = new THREE.MeshPhongMaterial({
      emissive: 0x000ff,
      color: 0x2233ff,
    })
    const moonMaterial = new THREE.MeshPhongMaterial({ emissive: 0x888888 })

    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
    sunMesh.scale.set(4, 4, 4)
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
    moonMesh.scale.set(0.5, 0.5, 0.5)

    const scene = new THREE.Scene()
    const solarSystem = new THREE.Object3D()
    const earthOrbit = new THREE.Object3D()
    earthOrbit.position.x = 10
    const moonOrbit = new THREE.Object3D()
    moonOrbit.position.x = 2
    const light = new THREE.PointLight(0xffffff, 1500)

    scene.add(light)
    scene.add(solarSystem)
    solarSystem.add(sunMesh)
    solarSystem.add(earthOrbit)

    earthOrbit.add(earthMesh)
    earthOrbit.add(moonOrbit)

    moonOrbit.add(moonMesh)

    const points = [solarSystem, sunMesh, earthOrbit, earthMesh, moonOrbit]
    function animate() {
      requestAnimationFrame(animate)
      points.forEach((point) => {
        point.rotation.y += 0.015
      })
      renderer.render(scene, camera)
    }
    const cancelRaf = animate()
    return cancelRaf
  }, [])

  return <div ref={containerRef} />
}

export default ThreeSunEarthMoon
