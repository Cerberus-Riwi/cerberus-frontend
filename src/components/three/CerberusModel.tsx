import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AuthMode } from '../../types/cerberus'

interface CerberusModelProps {
  mode: AuthMode
}

// Posición, rotación base y escala de cada cabeza
const HEAD_CONFIGS = [
  { position: [0,     0.5,   0.4 ] as [number, number, number], baseRy: 0,     scale: 1    },
  { position: [-1.28, -0.05, -0.12] as [number, number, number], baseRy: 0.52,  scale: 0.92 },
  { position: [1.28,  -0.05, -0.12] as [number, number, number], baseRy: -0.52, scale: 0.92 },
]

const BODY_MAT: THREE.MeshStandardMaterialParameters = {
  color: 0x243349,
  flatShading: true,
  metalness: 0.25,
  roughness: 0.55,
  emissive: new THREE.Color(0x0a1424),
  emissiveIntensity: 0.45,
}

export function CerberusModel({ mode }: CerberusModelProps) {
  const groupRef   = useRef<THREE.Group>(null)
  const headRefs   = useRef<(THREE.Group | null)[]>([null, null, null])
  const eyeMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const rimRef     = useRef<THREE.PointLight>(null)
  const rim2Ref    = useRef<THREE.PointLight>(null)
  const tmouse     = useRef({ x: 0, y: 0 })

  // Material compartido para los ojos — un único objeto Three.js
  // para que el lerp de color aplique a todos los ojos a la vez
  const eyeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x22d3ee }), [])

  useFrame(({ pointer, clock }) => {
    const t = clock.getElapsedTime()

    // Suavizado del mouse (lerp 6%)
    tmouse.current.x += (pointer.x - tmouse.current.x) * 0.06
    tmouse.current.y += (pointer.y - tmouse.current.y) * 0.06

    // Movimiento del grupo completo
    if (groupRef.current) {
      groupRef.current.rotation.y = tmouse.current.x * 0.45 + Math.sin(t * 0.4) * 0.05
      groupRef.current.rotation.x = -tmouse.current.y * 0.25
      groupRef.current.position.y = -0.05 + Math.sin(t * 0.8) * 0.08
    }

    // Cada cabeza sigue al mouse de forma individual
    headRefs.current.forEach((head, i) => {
      if (!head) return
      head.rotation.y = HEAD_CONFIGS[i].baseRy + tmouse.current.x * 0.38
      head.rotation.x = -tmouse.current.y * 0.32 + Math.sin(t * 1.1 + i) * 0.04
    })

    // Lerp de colores de ojos y luces rim según el modo
    const isLogin = mode === 'login'
    eyeMaterial.color.lerp(new THREE.Color(isLogin ? 0x6cf0ff : 0xffc24b), 0.06)
    rimRef.current?.color.lerp(new THREE.Color(isLogin ? 0x22d3ee : 0xff8a3d), 0.06)
    rim2Ref.current?.color.lerp(new THREE.Color(isLogin ? 0x3b82f6 : 0xff4d1c), 0.06)
  })

  return (
    <>
      {/* Luces de la escena */}
      <ambientLight color={0x4a5a7a} intensity={0.55} />
      <directionalLight color={0xffffff} intensity={0.85} position={[3, 5, 4]} />
      <pointLight ref={rimRef}  color={0x22d3ee} intensity={1.6} distance={30} position={[-4, 2, 3]} />
      <pointLight ref={rim2Ref} color={0x3b82f6} intensity={1.1} distance={30} position={[4, -1, 2]} />

      {/* Cuerpo del Cerbero */}
      <group ref={groupRef} position={[0, -0.05, 0]}>
        {/* Las 3 cabezas */}
        {HEAD_CONFIGS.map((cfg, i) => (
          <group
            key={i}
            ref={(el) => { headRefs.current[i] = el }}
            position={cfg.position}
            rotation={[0, cfg.baseRy, 0]}
            scale={cfg.scale}
          >
            {/* Cráneo */}
            <mesh scale={[1, 0.92, 1.18]}>
              <icosahedronGeometry args={[0.62, 1]} />
              <meshStandardMaterial {...BODY_MAT} />
            </mesh>
            {/* Hocico */}
            <mesh position={[0, -0.14, 0.72]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
              <coneGeometry args={[0.34, 0.95, 4]} />
              <meshStandardMaterial {...BODY_MAT} />
            </mesh>
            {/* Oreja izquierda */}
            <mesh position={[-0.33, 0.56, -0.04]} rotation={[0, 0, 0.32]}>
              <coneGeometry args={[0.17, 0.52, 4]} />
              <meshStandardMaterial {...BODY_MAT} />
            </mesh>
            {/* Oreja derecha */}
            <mesh position={[0.33, 0.56, -0.04]} rotation={[0, 0, -0.32]}>
              <coneGeometry args={[0.17, 0.52, 4]} />
              <meshStandardMaterial {...BODY_MAT} />
            </mesh>
            {/* Ojos — comparten el mismo material para el lerp de color */}
            <mesh position={[-0.21, 0.06, 0.52]}>
              <sphereGeometry args={[0.085, 10, 10]} />
              <primitive object={eyeMaterial} attach="material" />
            </mesh>
            <mesh position={[0.21, 0.06, 0.52]}>
              <sphereGeometry args={[0.085, 10, 10]} />
              <primitive object={eyeMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Pecho — cono hexagonal */}
        <mesh position={[0, -1.55, -0.15]} rotation={[0, Math.PI / 6, 0]}>
          <coneGeometry args={[1.7, 1.9, 6]} />
          <meshStandardMaterial {...BODY_MAT} />
        </mesh>

        {/* Núcleo — icosaedro aplanado */}
        <mesh position={[0, -1.0, 0.15]} scale={[1.15, 0.8, 1]}>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial {...BODY_MAT} />
        </mesh>
      </group>
    </>
  )
}
