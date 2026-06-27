import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AuthMode } from '../../types/cerberus'

const N = 420

interface GuardianParticlesProps {
  mode: AuthMode
}

export function GuardianParticles({ mode }: GuardianParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)

  const { geometry, velocities } = useMemo(() => {
    const positions = new Float32Array(N * 3)
    const velocities = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 13
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      velocities[i] = 0.004 + Math.random() * 0.018
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry, velocities }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !matRef.current) return

    // Flota las partículas hacia arriba con wraparound
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    for (let i = 0; i < N; i++) {
      arr[i * 3 + 1] += velocities[i]
      if (arr[i * 3 + 1] > 5.6) arr[i * 3 + 1] = -5.6
    }
    posAttr.needsUpdate = true

    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03

    // Lerp del color de partículas según el modo
    const target = new THREE.Color(mode === 'login' ? 0x49b9e8 : 0xff8a3d)
    matRef.current.color.lerp(target, 0.06)
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        color={0x49b9e8}
        size={0.07}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
