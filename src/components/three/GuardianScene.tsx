import { Canvas } from '@react-three/fiber'
import { CerberusModel } from './CerberusModel'
import { GuardianParticles } from './GuardianParticles'
import type { AuthMode } from '../../types/cerberus'

interface GuardianSceneProps {
  mode: AuthMode
}

export function GuardianScene({ mode }: GuardianSceneProps) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.3, 7.2], fov: 45, near: 0.1, far: 100 }}
    >
      <CerberusModel mode={mode} />
      <GuardianParticles mode={mode} />
    </Canvas>
  )
}
