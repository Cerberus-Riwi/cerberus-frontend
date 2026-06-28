import { Suspense, Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { CerberusModel } from './CerberusModel'
import { GuardianParticles } from './GuardianParticles'
import type { AuthMode } from '../../types/cerberus'

interface GuardianSceneProps {
  mode: AuthMode
}

// Error boundary para errores de carga del GLB — los errores de R3F no los
// captura Suspense (que solo maneja promesas), necesitan un ErrorBoundary separado
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

// Geometría mínima que se muestra si el GLB falla — nunca pantalla negra
function FallbackGeometry() {
  return (
    <mesh position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial color={0x22d3ee} emissive={0x0a3a4a} emissiveIntensity={0.8} flatShading />
    </mesh>
  )
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
      <GLBErrorBoundary>
        <Suspense fallback={<FallbackGeometry />}>
          <CerberusModel mode={mode} />
        </Suspense>
      </GLBErrorBoundary>
      <GuardianParticles mode={mode} />
    </Canvas>
  )
}
