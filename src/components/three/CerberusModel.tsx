import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { AuthMode } from '../../types/cerberus'

// Preload al importar el módulo — evita spinner en primera visita
useGLTF.preload('/models/cerberus-stay.glb')
useGLTF.preload('/models/cerberus-walk.glb')

interface CerberusModelProps {
  mode: AuthMode
}

export function CerberusModel({ mode }: CerberusModelProps) {
  const groupRef    = useRef<THREE.Group>(null)
  const rimRef      = useRef<THREE.PointLight>(null)
  const rim2Ref     = useRef<THREE.PointLight>(null)
  const tmouse      = useRef({ x: 0, y: 0 })
  const emissive    = useRef(new THREE.Color(0x001433))
  const emTarget    = useRef(new THREE.Color(0x001433))

  const url = mode === 'login' ? '/models/cerberus-stay.glb' : '/models/cerberus-walk.glb'
  const { scene } = useGLTF(url)

  // Clonar la escena completa para que cada instancia tenga su propio grafo
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    // Clonar materiales — evita que compartir un material entre dos renders
    // cause que emissive de uno afecte al otro
    clone.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = Array.isArray(child.material)
          ? child.material.map(m => m.clone())
          : child.material.clone()
      }
    })
    return clone
  }, [scene])

  // Extraer los meshes una sola vez para no recorrer el árbol en cada frame
  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = []
    clonedScene.traverse(child => {
      if (child instanceof THREE.Mesh) list.push(child)
    })
    return list
  }, [clonedScene])

  // Liberar geometrías y materiales clonados cuando el componente se desmonta
  useEffect(() => {
    return () => {
      meshes.forEach(mesh => {
        mesh.geometry?.dispose()
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach(m => (m as THREE.Material)?.dispose())
      })
    }
  }, [meshes])

  useFrame(({ pointer, clock, camera }) => {
    const t = clock.getElapsedTime()
    const isLogin = mode === 'login'

    // Desplazar cámara para centrar el modelo en la MITAD LIBRE de pantalla
    // (la opuesta al formulario). Login → forma a la derecha, Cerbero a la
    // izquierda; registro → al revés. Un offset mayor lo aleja del divisor y
    // lo deja centrado en su mitad en vez de pegado al panel.
    const camTargetX = isLogin ? 2.5 : -2.5
    camera.position.x += (camTargetX - camera.position.x) * 0.05

    // Suavizado de mouse
    tmouse.current.x += (pointer.x - tmouse.current.x) * 0.06
    tmouse.current.y += (pointer.y - tmouse.current.y) * 0.06

    // Rotación y flotado del grupo completo
    if (groupRef.current) {
      groupRef.current.rotation.y = tmouse.current.x * 0.44 + Math.sin(t * 0.38) * 0.05
      groupRef.current.rotation.x = -tmouse.current.y * 0.22
      groupRef.current.position.y = Math.sin(t * 0.78) * 0.07
    }

    // Lerp del color emissive según modo (sin crear objetos nuevos en cada frame)
    emTarget.current.set(isLogin ? 0x002a4a : 0x2a0f00)
    emissive.current.lerp(emTarget.current, 0.04)

    meshes.forEach(mesh => {
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (mat?.emissive) {
        mat.emissive.copy(emissive.current)
        mat.emissiveIntensity = 0.55
      }
    })

    // Lerp de luces rim
    rimRef.current?.color.lerp(new THREE.Color(isLogin ? 0x22d3ee : 0xff8a3d), 0.06)
    rim2Ref.current?.color.lerp(new THREE.Color(isLogin ? 0x3b82f6 : 0xff4d1c), 0.06)
  })

  return (
    <>
      <ambientLight color={0x4a5a7a} intensity={0.9} />
      <directionalLight color={0xffffff} intensity={1.1} position={[3, 6, 5]} />
      <pointLight ref={rimRef}  color={0x22d3ee} intensity={2.2} distance={28} position={[-4, 2, 3]} />
      <pointLight ref={rim2Ref} color={0x3b82f6} intensity={1.6} distance={28} position={[4, -1, 2]} />

      {/* scale=3 → modelo de ~0.82m se ve a ~2.5m de alto en pantalla */}
      <group ref={groupRef} position={[0, -1.0, 0]} scale={3}>
        <primitive object={clonedScene} />
      </group>
    </>
  )
}
