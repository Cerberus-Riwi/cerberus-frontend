import { Suspense, Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { CerberusModel } from './CerberusModel'
import { GuardianParticles } from './GuardianParticles'
import type { AuthMode } from '../../types/cerberus'

interface GuardianSceneProps {
  mode: AuthMode
}

class GLBErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    if (this.state.error) return <FallbackGeometry />
    return this.props.children
  }
}

// Fallback visible cuando el GLB falla — usa emissive alto para verse sin luces
function FallbackGeometry() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color={0x22d3ee}
        emissive={0x22d3ee}
        emissiveIntensity={0.6}
        flatShading
      />
    </mesh>
  )
}

export function GuardianScene({ mode }: GuardianSceneProps) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.3, 7.2], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      frameloop="always"
    >
      {/* Luces base siempre presentes — independientes del modelo GLB */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 6, 5]} intensity={1.0} />

      <GLBErrorBoundary>
        <Suspense fallback={<FallbackGeometry />}>
          <CerberusModel mode={mode} />
        </Suspense>
      </GLBErrorBoundary>

      <GuardianParticles mode={mode} />
    </Canvas>
  )
}
