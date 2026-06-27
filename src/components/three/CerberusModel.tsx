import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AuthMode } from '../../types/cerberus'

interface CerberusModelProps {
  mode: AuthMode
}

const HEAD_CONFIGS = [
  { position: [0,     0.5,    0.4 ] as [number, number, number], baseRy: 0,     scale: 1    },
  { position: [-1.28, -0.05, -0.12] as [number, number, number], baseRy: 0.52,  scale: 0.92 },
  { position: [1.28,  -0.05, -0.12] as [number, number, number], baseRy: -0.52, scale: 0.92 },
]

// JSX para el material del cuerpo — cada mesh crea su propia instancia.
// Así R3F no tiene que rastrear un objeto Three.js compartido entre varios nodos.
function BodyMat() {
  return (
    <meshStandardMaterial
      color={0x243349}
      flatShading
      metalness={0.25}
      roughness={0.55}
      emissive={0x0a1424}
      emissiveIntensity={0.45}
    />
  )
}

// Cada ojo maneja su propio material. El color se copia del ref compartido
// en cada frame sin causar re-renders de React.
function CerberusEye({
  position,
  colorRef,
}: {
  position: [number, number, number]
  colorRef: React.RefObject<THREE.Color>
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    if (matRef.current && colorRef.current) {
      matRef.current.color.copy(colorRef.current)
    }
  })

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.085, 10, 10]} />
      <meshBasicMaterial ref={matRef} color={0x22d3ee} />
    </mesh>
  )
}

export function CerberusModel({ mode }: CerberusModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRefs = useRef<(THREE.Group | null)[]>([null, null, null])
  const rimRef   = useRef<THREE.PointLight>(null)
  const rim2Ref  = useRef<THREE.PointLight>(null)
  const tmouse   = useRef({ x: 0, y: 0 })
  const eyeColor = useRef(new THREE.Color(0x22d3ee))

  useFrame(({ pointer, clock }) => {
    const t = clock.getElapsedTime()
    const isLogin = mode === 'login'

    tmouse.current.x += (pointer.x - tmouse.current.x) * 0.06
    tmouse.current.y += (pointer.y - tmouse.current.y) * 0.06

    if (groupRef.current) {
      groupRef.current.rotation.y = tmouse.current.x * 0.45 + Math.sin(t * 0.4) * 0.05
      groupRef.current.rotation.x = -tmouse.current.y * 0.25
      groupRef.current.position.y = -0.05 + Math.sin(t * 0.8) * 0.08
    }

    headRefs.current.forEach((head, i) => {
      if (!head) return
      head.rotation.y = HEAD_CONFIGS[i].baseRy + tmouse.current.x * 0.38
      head.rotation.x = -tmouse.current.y * 0.32 + Math.sin(t * 1.1 + i) * 0.04
    })

    eyeColor.current.lerp(new THREE.Color(isLogin ? 0x6cf0ff : 0xffc24b), 0.06)
    rimRef.current?.color.lerp(new THREE.Color(isLogin ? 0x22d3ee : 0xff8a3d), 0.06)
    rim2Ref.current?.color.lerp(new THREE.Color(isLogin ? 0x3b82f6 : 0xff4d1c), 0.06)
  })

  return (
    <>
      <ambientLight color={0x4a5a7a} intensity={0.55} />
      <directionalLight color={0xffffff} intensity={0.85} position={[3, 5, 4]} />
      <pointLight ref={rimRef}  color={0x22d3ee} intensity={1.6} distance={30} position={[-4, 2, 3]} />
      <pointLight ref={rim2Ref} color={0x3b82f6} intensity={1.1} distance={30} position={[4, -1, 2]} />

      <group ref={groupRef} position={[0, -0.05, 0]}>
        {HEAD_CONFIGS.map((cfg, i) => (
          <group
            key={i}
            ref={(el) => { headRefs.current[i] = el }}
            position={cfg.position}
            rotation={[0, cfg.baseRy, 0]}
            scale={cfg.scale}
          >
            <mesh scale={[1, 0.92, 1.18]}>
              <icosahedronGeometry args={[0.62, 1]} /><BodyMat />
            </mesh>
            <mesh position={[0, -0.14, 0.72]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
              <coneGeometry args={[0.34, 0.95, 4]} /><BodyMat />
            </mesh>
            <mesh position={[-0.33, 0.56, -0.04]} rotation={[0, 0, 0.32]}>
              <coneGeometry args={[0.17, 0.52, 4]} /><BodyMat />
            </mesh>
            <mesh position={[0.33, 0.56, -0.04]} rotation={[0, 0, -0.32]}>
              <coneGeometry args={[0.17, 0.52, 4]} /><BodyMat />
            </mesh>
            <CerberusEye position={[-0.21, 0.06, 0.52]} colorRef={eyeColor} />
            <CerberusEye position={[ 0.21, 0.06, 0.52]} colorRef={eyeColor} />
          </group>
        ))}

        <mesh position={[0, -1.55, -0.15]} rotation={[0, Math.PI / 6, 0]}>
          <coneGeometry args={[1.7, 1.9, 6]} /><BodyMat />
        </mesh>
        <mesh position={[0, -1.0, 0.15]} scale={[1.15, 0.8, 1]}>
          <icosahedronGeometry args={[1.15, 0]} /><BodyMat />
        </mesh>
      </group>
    </>
  )
}
