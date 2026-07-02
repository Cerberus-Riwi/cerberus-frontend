import { useEffect, useRef, Suspense } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Bounds, Center } from '@react-three/drei'
import * as THREE from 'three'

const LOGO_SIZE = 240
useGLTF.preload('/models/3DLogotipo.glb')

// ── interpolación suave entre keyframes ──────────────────────────────────────
function smoothstep(t: number) { return t * t * (3 - 2 * t) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function interpPath(kf: Array<{ p: number; x: number }>, p: number) {
  if (p <= kf[0].p) return kf[0].x
  for (let i = 1; i < kf.length; i++) {
    if (p <= kf[i].p) {
      const t = (p - kf[i - 1].p) / (kf[i].p - kf[i - 1].p)
      return lerp(kf[i - 1].x, kf[i].x, smoothstep(t))
    }
  }
  return kf[kf.length - 1].x
}

interface Props {
  wrapperRef: RefObject<HTMLDivElement | null>
}

export function ScrollLogo3D({ wrapperRef }: Props) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const innerRef       = useRef<HTMLDivElement>(null)
  const hasAppeared    = useRef(false)

  useEffect(() => {
    const wrapper   = wrapperRef.current
    const container = containerRef.current
    const inner     = innerRef.current
    if (!wrapper || !container || !inner) return

    const amp = () => Math.min(220, window.innerWidth * 0.26)

    // obtener posición relativa (0-1) de una sección dentro del lightZone
    const sectionRange = (id: string, scrollLen: number, wrapTop: number) => {
      const el = document.getElementById(id)
      if (!el) return null
      const top    = el.getBoundingClientRect().top + window.scrollY - wrapTop
      const bottom = top + el.offsetHeight
      return {
        start: top / scrollLen,
        mid:   (top + el.offsetHeight * 0.5) / scrollLen,
        end:   bottom / scrollLen,
      }
    }

    const placeAt = (rawProg: number) => {
      const vh  = window.innerHeight
      const vw  = window.innerWidth
      const p   = Math.max(0, Math.min(1, rawProg))
      const a   = amp()

      const wrapTop   = wrapper.getBoundingClientRect().top + window.scrollY
      const scrollLen = Math.max(1, wrapper.offsetHeight - vh)

      const pipeline     = sectionRange('pipeline',     scrollLen, wrapTop)
      const herramientas = sectionRange('herramientas', scrollLen, wrapTop)
      const advisor      = sectionRange('advisor',      scrollLen, wrapTop)

      // ── keyframes de posición horizontal ──────────────────────────────────
      // Construidos dinámicamente con posiciones reales de cada sección
      const keyframes: Array<{ p: number; x: number }> = [
        { p: 0, x: 0 },
      ]

      if (pipeline) {
        keyframes.push(
          { p: pipeline.start, x: 0 },
          { p: pipeline.mid,   x: +a },         // derecha al centro del pipeline
          { p: pipeline.end,   x: 0 },
        )
      }

      if (herramientas) {
        keyframes.push(
          { p: herramientas.start, x: 0 },      // entra centrado
          { p: herramientas.mid,   x: 0 },      // pasa centrado por las cards
          { p: herramientas.end,   x: 0 },      // sale centrado
        )
      }

      if (advisor) {
        keyframes.push(
          { p: advisor.start, x: 0 },
          { p: advisor.mid,   x: -a * 2.1 },   // lejos a la izquierda
          { p: advisor.end,   x: -a * 1.6 },
        )
      }

      keyframes.push({ p: 1, x: advisor ? -a * 1.4 : 0 })

      const xOff   = interpPath(keyframes, p)
      const screenX = vw / 2 + xOff
      const screenY = 120 + p * (vh - 260)

      container.style.transform = `translate3d(${screenX - LOGO_SIZE / 2}px, ${screenY - LOGO_SIZE / 2}px, 0)`

      // ── zoom-in al aparecer por primera vez ───────────────────────────────
      if (rawProg < 0) {
        // fuera del rango → oculto, listo para volver a animar
        hasAppeared.current = false
        inner.style.transition = 'none'
        inner.style.transform  = 'scale(0.08)'
        inner.style.opacity    = '0'
      } else if (!hasAppeared.current) {
        hasAppeared.current = true
        // forzar estado inicial sin transición, luego activar transición en el próximo frame
        inner.style.transition = 'none'
        inner.style.transform  = 'scale(0.08)'
        inner.style.opacity    = '0'
        requestAnimationFrame(() => {
          inner.style.transition = 'transform 0.75s cubic-bezier(0.34, 1.45, 0.64, 1), opacity 0.45s ease'
          inner.style.transform  = 'scale(1)'
          inner.style.opacity    = '1'
        })
      }
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
    // container: solo posición (translate3d)
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: 'fixed', top: 0, left: 0,
        width: LOGO_SIZE, height: LOGO_SIZE,
        zIndex: 6,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      {/* inner: zoom + opacity — animación de entrada */}
      <div
        ref={innerRef}
        style={{
          width: '100%', height: '100%',
          transform: 'scale(0.08)',
          opacity: 0,
          transformOrigin: 'center center',
        }}
      >
        <Canvas
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={1.6} />
          <directionalLight position={[4, 5, 6]}   intensity={2.4} />
          <directionalLight position={[-3, -2, -4]} intensity={0.8} color="#ffb87a" />
          <Suspense fallback={null}>
            <Bounds fit clip observe={false} margin={1.15}>
              <LogoModel />
            </Bounds>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

function LogoModel() {
  const { scene } = useGLTF('/models/3DLogotipo.glb')
  const groupRef  = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.5
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene.clone(true)} />
      </Center>
    </group>
  )
}
