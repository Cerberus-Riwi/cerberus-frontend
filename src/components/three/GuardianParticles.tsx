import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AuthMode } from '../../types/cerberus'

const N = 360

interface GuardianParticlesProps {
  mode: AuthMode
}

export function GuardianParticles({ mode }: GuardianParticlesProps) {
  const pointsRef  = useRef<THREE.Points>(null)
  const matRef     = useRef<THREE.PointsMaterial>(null)
  const colorTarget = useRef(new THREE.Color(0x49b9e8))

  const { geo, velocities } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const vel = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 9
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      vel[i]         = 0.005 + Math.random() * 0.016
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo: g, velocities: vel }
  }, [])

  useFrame(({ clock }) => {
    const pts = pointsRef.current
    const mat = matRef.current
    if (!pts || !mat) return

    const attr = pts.geometry.attributes.position as THREE.BufferAttribute
    const arr  = attr.array as Float32Array
    for (let i = 0; i < N; i++) {
      arr[i * 3 + 1] += velocities[i]
      if (arr[i * 3 + 1] > 4.5) arr[i * 3 + 1] = -4.5
    }
    attr.needsUpdate = true

    pts.rotation.y = clock.getElapsedTime() * 0.025

    colorTarget.current.set(mode === 'login' ? 0x49b9e8 : 0xff8a3d)
    mat.color.lerp(colorTarget.current, 0.06)
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
