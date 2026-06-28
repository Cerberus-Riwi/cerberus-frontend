import { Suspense } from 'react'
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
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.3, 7.2], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
    >
      {/* Suspense requerido por useGLTF — las partículas se renderizan siempre */}
      <Suspense fallback={null}>
        <CerberusModel mode={mode} />
      </Suspense>
      <GuardianParticles mode={mode} />
    </Canvas>
  )
}
