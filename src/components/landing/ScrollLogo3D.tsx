import { useEffect, useRef, Suspense } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

const LOGO_SIZE = 200   // px — canvas 3D
const WAVES     = 2
const PHASE     = 0

// precargar para evitar parpadeo
useGLTF.preload('/models/3DLogotipo.glb')

interface Props {
  wrapperRef: RefObject<HTMLDivElement | null>
}

export function ScrollLogo3D({ wrapperRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper   = wrapperRef.current
    const container = containerRef.current
    if (!wrapper || !container) return

    const amplitude = () => Math.min(200, window.innerWidth * 0.26)

    const placeAt = (rawProg: number) => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const p  = Math.max(0, Math.min(1, rawProg))

      const screenY = 120 + p * (vh - 260)
      const env     = Math.sin(p * Math.PI)
      let xOff      = -env * amplitude() * Math.sin(p * WAVES * Math.PI * 2 + PHASE)

      // AI Advisor (xOff negativo = va a la izquierda): empujar más lejos del contenido
      if (xOff < 0) xOff *= 1.8

      const screenX = vw / 2 + xOff

      // Fade in rápido al entrar, NO desaparece al final — se queda visible
      const alpha = rawProg < 0 ? 0 : Math.min(1, rawProg * 10)

      container.style.transform = `translate3d(${screenX - LOGO_SIZE / 2}px, ${screenY - LOGO_SIZE / 2}px, 0)`
      container.style.opacity   = String(alpha)
    }

    const onScroll = () => {
      const wt      = wrapper.getBoundingClientRect().top + window.scrollY
      const wh      = wrapper.offsetHeight
      const vh      = window.innerHeight
      const rawProg = (window.scrollY - wt) / Math.max(1, wh - vh)
      placeAt(rawProg)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const ro = new ResizeObserver(onScroll)
    ro.observe(wrapper)

    return () => {
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [wrapperRef])

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: 'fixed', top: 0, left: 0,
        width: LOGO_SIZE, height: LOGO_SIZE,
        zIndex: 6,
        pointerEvents: 'none',
        opacity: 0,
        willChange: 'transform',
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 4], fov: 38 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 5, 6]} intensity={2.2} />
        <directionalLight position={[-3, -2, -4]} intensity={0.6} color="#ffb87a" />
        <Suspense fallback={null}>
          <LogoModel />
        </Suspense>
      </Canvas>
    </div>
  )
}

function LogoModel() {
  const { scene } = useGLTF('/models/3DLogotipo.glb')
  const groupRef  = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.55
    }
  })

  // clonar para evitar mutar la escena original si el componente se re-monta
  const cloned = scene.clone(true)

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  )
}
