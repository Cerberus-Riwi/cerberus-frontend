import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AuthMode } from '../../types/cerberus'

interface CerberusModelProps {
  mode: AuthMode
}

// Posición, rotación base y escala de cada cabeza
const HEAD_CONFIGS = [
  { pos: [ 0,      0.42,  0.22] as [number,number,number], ry:  0,     rx:  0.0,  scale: 1    },
  { pos: [-1.38,  -0.12, -0.1 ] as [number,number,number], ry:  0.46,  rx: -0.12, scale: 0.9  },
  { pos: [ 1.38,  -0.12, -0.1 ] as [number,number,number], ry: -0.46,  rx: -0.12, scale: 0.9  },
]

const BODY_MAT_PROPS = {
  color: 0x1e2d42,
  flatShading: true,
  metalness: 0.3,
  roughness: 0.6,
  emissive: 0x091220,
  emissiveIntensity: 0.55,
} as const

const ACCENT_MAT_PROPS = {
  color: 0x111c2e,
  flatShading: true,
  metalness: 0.15,
  roughness: 0.75,
  emissive: 0x040c18,
  emissiveIntensity: 0.4,
} as const

function CerberusEye({
  position,
  colorRef,
}: {
  position: [number, number, number]
  colorRef: React.RefObject<THREE.Color>
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    if (matRef.current && colorRef.current) matRef.current.color.copy(colorRef.current)
  })
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.078, 6, 6]} />
      <meshBasicMaterial ref={matRef} color={0x22d3ee} />
    </mesh>
  )
}

// Cabeza low-poly de lobo: cráneo + hocico + orejas + ojos
function WolfHead({ colorRef }: { colorRef: React.RefObject<THREE.Color> }) {
  return (
    <group>
      {/* Cráneo */}
      <mesh>
        <boxGeometry args={[1.06, 0.88, 0.96]} />
        <meshStandardMaterial {...BODY_MAT_PROPS} />
      </mesh>

      {/* Hocico (protuye hacia +Z desde la parte baja del cráneo) */}
      <mesh position={[0, -0.2, 0.72]}>
        <boxGeometry args={[0.58, 0.38, 0.62]} />
        <meshStandardMaterial {...BODY_MAT_PROPS} />
      </mesh>

      {/* Punta del hocico / nariz */}
      <mesh position={[0, -0.22, 1.02]}>
        <boxGeometry args={[0.34, 0.2, 0.1]} />
        <meshStandardMaterial {...ACCENT_MAT_PROPS} />
      </mesh>

      {/* Mejillas — añaden volumen a los lados del hocico */}
      <mesh position={[-0.42, -0.08, 0.58]} rotation={[0, 0.28, 0]}>
        <boxGeometry args={[0.22, 0.32, 0.42]} />
        <meshStandardMaterial {...BODY_MAT_PROPS} />
      </mesh>
      <mesh position={[ 0.42, -0.08, 0.58]} rotation={[0, -0.28, 0]}>
        <boxGeometry args={[0.22, 0.32, 0.42]} />
        <meshStandardMaterial {...BODY_MAT_PROPS} />
      </mesh>

      {/* Oreja izquierda */}
      <mesh position={[-0.35, 0.74, 0.06]} rotation={[0.06, 0, 0.2]}>
        <coneGeometry args={[0.2, 0.68, 4]} />
        <meshStandardMaterial {...BODY_MAT_PROPS} />
      </mesh>

      {/* Oreja derecha */}
      <mesh position={[ 0.35, 0.74, 0.06]} rotation={[0.06, 0, -0.2]}>
        <coneGeometry args={[0.2, 0.68, 4]} />
        <meshStandardMaterial {...BODY_MAT_PROPS} />
      </mesh>

      {/* Ojos */}
      <CerberusEye position={[-0.26, 0.08, 0.49]} colorRef={colorRef} />
      <CerberusEye position={[ 0.26, 0.08, 0.49]} colorRef={colorRef} />
    </group>
  )
}

export function CerberusModel({ mode }: CerberusModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRefs = useRef<(THREE.Group | null)[]>([null, null, null])
  const rimRef   = useRef<THREE.PointLight>(null)
  const rim2Ref  = useRef<THREE.PointLight>(null)
  const tmouse   = useRef({ x: 0, y: 0 })
  const eyeColor = useRef(new THREE.Color(0x22d3ee))

  useFrame(({ pointer, clock, camera }) => {
    const t = clock.getElapsedTime()
    const isLogin = mode === 'login'

    // Desplaza la cámara para centrar el modelo en la mitad opuesta al form
    const camTargetX = isLogin ? 1.5 : -1.5
    camera.position.x += (camTargetX - camera.position.x) * 0.04

    // Suavizado del mouse
    tmouse.current.x += (pointer.x - tmouse.current.x) * 0.06
    tmouse.current.y += (pointer.y - tmouse.current.y) * 0.06

    // Rotación y flotado del grupo completo
    if (groupRef.current) {
      groupRef.current.rotation.y = tmouse.current.x * 0.44 + Math.sin(t * 0.38) * 0.05
      groupRef.current.rotation.x = -tmouse.current.y * 0.22
      groupRef.current.position.y = -0.05 + Math.sin(t * 0.78) * 0.07
    }

    // Cada cabeza sigue el mouse con leve variación por cabeza
    headRefs.current.forEach((head, i) => {
      if (!head) return
      head.rotation.y = HEAD_CONFIGS[i].ry + tmouse.current.x * 0.36
      head.rotation.x = HEAD_CONFIGS[i].rx - tmouse.current.y * 0.28 + Math.sin(t * 1.1 + i) * 0.033
    })

    // Lerp de color de ojos y luces según modo
    eyeColor.current.lerp(new THREE.Color(isLogin ? 0x6cf0ff : 0xffc24b), 0.06)
    rimRef.current?.color.lerp(new THREE.Color(isLogin ? 0x22d3ee : 0xff8a3d), 0.06)
    rim2Ref.current?.color.lerp(new THREE.Color(isLogin ? 0x3b82f6 : 0xff4d1c), 0.06)
  })

  return (
    <>
      <ambientLight color={0x3a4a65} intensity={0.6} />
      <directionalLight color={0xffffff} intensity={0.9} position={[3, 5, 5]} castShadow={false} />
      <pointLight ref={rimRef}  color={0x22d3ee} intensity={1.8} distance={32} position={[-4, 2, 3]} />
      <pointLight ref={rim2Ref} color={0x3b82f6} intensity={1.2} distance={32} position={[4, -1, 2]} />

      <group ref={groupRef} position={[0, -0.05, 0]}>
        {/* Tres cabezas */}
        {HEAD_CONFIGS.map((cfg, i) => (
          <group
            key={i}
            ref={el => { headRefs.current[i] = el }}
            position={cfg.pos}
            rotation={[cfg.rx, cfg.ry, 0]}
            scale={cfg.scale}
          >
            <WolfHead colorRef={eyeColor} />
          </group>
        ))}

        {/* Cuello central */}
        <mesh position={[0, -0.82, 0.08]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.82, 1.05, 6]} />
          <meshStandardMaterial {...BODY_MAT_PROPS} />
        </mesh>

        {/* Cuello izquierdo */}
        <mesh position={[-0.84, -0.52, -0.02]} rotation={[0.18, 0.28, 0.38]}>
          <cylinderGeometry args={[0.3, 0.48, 0.82, 5]} />
          <meshStandardMaterial {...BODY_MAT_PROPS} />
        </mesh>

        {/* Cuello derecho */}
        <mesh position={[0.84, -0.52, -0.02]} rotation={[0.18, -0.28, -0.38]}>
          <cylinderGeometry args={[0.3, 0.48, 0.82, 5]} />
          <meshStandardMaterial {...BODY_MAT_PROPS} />
        </mesh>

        {/* Pecho */}
        <mesh position={[0, -1.56, 0.04]} scale={[1.15, 0.72, 0.88]}>
          <icosahedronGeometry args={[1.05, 0]} />
          <meshStandardMaterial {...BODY_MAT_PROPS} />
        </mesh>
      </group>
    </>
  )
}
