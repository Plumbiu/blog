import { CSSProperties, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { upperFirstChar } from '@/utils'
import { buildCamera, buildRenderer } from './utils'

const flexStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
}

interface ThreeItemProps {
  color: string
  roughness?: number
  metalness?: number
  clearcoat?: number
  width?: string
  clearCoatRoughness?: number
  materialType:
    | 'basic'
    | 'lambert'
    | 'phong'
    | 'toon'
    | 'standard'
    | 'physicalMaterial'
  shininess?: number
  lightDirection?: [number, number, number]
  noBottom?: boolean
}
function ThreeItem({
  color,
  materialType,
  shininess,
  lightDirection = [0, 0, 1],
  noBottom = false,
  width = '33%',
}: ThreeItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const renderer = buildRenderer(ref)
    renderer.setClearColor(0xffffff, 0)
    const camera = buildCamera(0, 0, 10)

    const sphereGeometry = new THREE.SphereGeometry(2, 16, 16)
    const config = { color, emissive: 0x0a0a88, shininess }
    let material:
      | THREE.MeshBasicMaterial
      | THREE.MeshLambertMaterial
      | THREE.MeshPhongMaterial
      | THREE.MeshToonMaterial
      | THREE.MeshStandardMaterial
      | THREE.MeshPhysicalMaterial = new THREE.MeshBasicMaterial(config)
    if (materialType === 'lambert') {
      material = new THREE.MeshLambertMaterial(config)
    } else if (materialType === 'phong') {
      material = new THREE.MeshPhongMaterial(config)
    } else if (materialType === 'toon') {
      material = new THREE.MeshToonMaterial(config)
    } else if (materialType === 'standard') {
      material = new THREE.MeshStandardMaterial(config)
    } else if (materialType === 'physicalMaterial') {
      material = new THREE.MeshPhysicalMaterial(config)
    }
    const light = new THREE.DirectionalLight(0x111111, 100)
    light.position.set(...lightDirection)

    const mesh = new THREE.Mesh(sphereGeometry, material)
    const scene = new THREE.Scene()
    scene.add(mesh)
    scene.add(light)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    controls.addEventListener('change', render)

    function render() {
      renderer.render(scene, camera)
    }
    render()

    return () => controls.removeEventListener('change', render)
  }, [])

  return (
    <div
      style={{
        width,
        textAlign: 'center',
      }}
    >
      <div ref={ref} />
      {noBottom ? null : (
        <>
          <div>{upperFirstChar(materialType)}</div>
          {shininess != null && <div>shininess: {shininess}</div>}
        </>
      )}
    </div>
  )
}

export function ThreeMaterialKinds() {
  return (
    <div style={flexStyles}>
      <ThreeItem materialType="basic" color="#4280BF" />
      <ThreeItem materialType="lambert" color="#4280BF" />
      <ThreeItem materialType="phong" color="#4280BF" />
    </div>
  )
}

export function ThreeMaterialKindsShininess() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <ThreeItem materialType="phong" color="#4280BF" shininess={0} />
      <ThreeItem materialType="phong" color="#4280BF" shininess={30} />
      <ThreeItem materialType="phong" color="#4280BF" shininess={150} />
    </div>
  )
}

export function ThreeMaterialToonKind() {
  return (
    <ThreeItem
      noBottom
      materialType="toon"
      color="#4280BF"
      shininess={0}
      lightDirection={[2, 1, 2]}
    />
  )
}
