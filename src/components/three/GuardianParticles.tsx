import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AuthMode } from '../../types/cerberus'

const N = 360

interface GuardianParticlesProps {
  mode: AuthMode
}

export function GuardianParticles({ mode }: GuardianParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef    = useRef<THREE.PointsMaterial>(null)

  const { geo, velocities } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const velocities = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 9
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      velocities[i]  = 0.005 + Math.random() * 0.016
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo, velocities }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !matRef.current) return

    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr  = attr.array as Float32Array
    for (let i = 0; i < N; i++) {
      arr[i * 3 + 1] += velocities[i]
      if (arr[i * 3 + 1] > 4.5) arr[i * 3 + 1] = -4.5
    }
    attr.needsUpdate = true

    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.025

    const target = new THREE.Color(mode === 'login' ? 0x49b9e8 : 0xff8a3d)
    matRef.current.color.lerp(target, 0.06)
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        ref={matRef}
        color={0x49b9e8}
        size={0.11}
        sizeAttenuation
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
