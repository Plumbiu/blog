'use client'
import { Canvas } from '@react-three/fiber'

function FirstScence() {
  return (
    <div>
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  )
}

export default FirstScence
