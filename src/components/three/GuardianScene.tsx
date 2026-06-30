import { Canvas } from '@react-three/fiber'
import type { AuthMode } from '../../types/cerberus'
import { GuardianParticles } from './GuardianParticles'

interface GuardianSceneProps {
  mode: AuthMode
}

export function GuardianScene({ mode }: GuardianSceneProps) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={0.3} />
      <GuardianParticles mode={mode} />
    </Canvas>
  )
}
