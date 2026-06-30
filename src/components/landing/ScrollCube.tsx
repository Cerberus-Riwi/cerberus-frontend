import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { HolographicCube, type CubeScrollState } from '../three/HolographicCube'

const CUBE_SIZE  = 200
const GLOW_SIZE  = 440
const WAVES      = 1.0
const PHASE      = 0.44 * Math.PI

interface ScrollCubeProps {
  wrapperRef: RefObject<HTMLDivElement | null>
}

export function ScrollCube({ wrapperRef }: ScrollCubeProps) {
  const cubeRef     = useRef<HTMLDivElement>(null)
  const glowRef     = useRef<HTMLDivElement>(null)
  const svgRef      = useRef<SVGSVGElement>(null)
  const p1Ref       = useRef<SVGPathElement>(null)
  const p2Ref       = useRef<SVGPathElement>(null)
  const p3Ref       = useRef<SVGPathElement>(null)
  const scrollState = useRef<CubeScrollState>({ velocity: 0 })
  // emissive 1 → 0 durante el primer 35% del scroll (zona oscura → zona clara)
  const emissiveRef = useRef<number>(1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const cube    = cubeRef.current
    const glow    = glowRef.current
    if (!wrapper || !cube || !glow) return

    const amplitude = () => Math.min(155, window.innerWidth * 0.22)

    const placeAt = (rawProg: number) => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const p  = Math.max(0, Math.min(1, rawProg))

      // Trayectoria: de screenY=100 → screenY=vh-100 con onda S invertida
      const screenY = 100 + p * (vh - 200)
      const env     = Math.sin(p * Math.PI)
      const xOff    = -env * amplitude() * Math.sin(p * WAVES * Math.PI * 2 + PHASE)
      const screenX = vw / 2 + xOff

      // Fade al entrar/salir de la zona de scroll
      const alpha = rawProg < 0 ? 0
        : rawProg > 1 ? 0
        : Math.min(1, rawProg * 8, (1 - rawProg) * 8)

      // Emissive: 1.0 al inicio (oscuridad), decae a 0 en el primer 35% del recorrido
      emissiveRef.current = Math.max(0, 1 - p / 0.35)

      // Glow exterior: más fuerte en la zona oscura
      const e      = emissiveRef.current
      const glowPx = Math.round(26 + e * 36)
      const glowA  = (0.88 + e * 0.12).toFixed(2)

      cube.style.transform    = `translate3d(${screenX - CUBE_SIZE / 2}px, ${screenY - CUBE_SIZE / 2}px, 0)`
      glow.style.transform    = `translate3d(${screenX - GLOW_SIZE / 2}px, ${screenY - GLOW_SIZE / 2}px, 0)`
      cube.style.opacity      = String(alpha)
      glow.style.opacity      = String(alpha * 0.9)
      cube.style.filter       = `drop-shadow(0 0 ${glowPx}px rgba(59,130,246,${glowA}))`
      cube.style.pointerEvents = alpha > 0.1 ? 'auto' : 'none'

      // Líneas: visibles cuando el cubo tiene suficiente opacidad
      const inLight = alpha > 0.3 && screenY > 40
      if (svgRef.current) svgRef.current.style.opacity = inLight ? '1' : '0'
      if (inLight && p1Ref.current && p2Ref.current && p3Ref.current) {
        const cx = screenX, cy = screenY
        p1Ref.current.setAttribute('d',
          `M ${vw * 0.03},${cy + 120} C ${cx * 0.25},${cy + 40} ${cx * 0.58},${cy - 30} ${cx},${cy}`)
        p2Ref.current.setAttribute('d',
          `M ${vw * 0.97},${cy + 90} C ${vw - cx * 0.35},${cy + 25} ${vw - cx * 0.16},${cy - 45} ${cx},${cy}`)
        p3Ref.current.setAttribute('d',
          `M ${vw * 0.5},${vh * 0.02} C ${cx + 100},${cy * 0.38} ${cx + 40},${cy * 0.72} ${cx},${cy}`)
      }
    }

    let lastY = window.scrollY
    let lastT = performance.now()

    const onScroll = () => {
      const now  = performance.now()
      const dy   = window.scrollY - lastY
      const dt   = Math.max(1, now - lastT)
      scrollState.current.velocity = dy / dt / 12
      lastY = window.scrollY
      lastT = now

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
    <>
      {/* Halo de luz — zIndex 4, por debajo del contenido de main */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: GLOW_SIZE, height: GLOW_SIZE,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.34) 0%, rgba(37,99,235,0.14) 38%, transparent 70%)',
          filter: 'blur(28px)',
          pointerEvents: 'none',
          zIndex: 4,
          opacity: 0,
          willChange: 'transform',
        }}
      />

      {/* Líneas sólidas que señalan al cubo — zIndex 5 */}
      <svg
        ref={svgRef}
        aria-hidden
        style={{
          position: 'fixed', inset: 0,
          width: '100vw', height: '100vh',
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 5,
          opacity: 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <defs>
          <style>{`
            @keyframes cubeBeamPulse {
              0%, 100% { opacity: 0.16 }
              50%       { opacity: 0.70 }
            }
          `}</style>
        </defs>
        <path ref={p1Ref} stroke="#3b82f6" strokeWidth="1.4" fill="none"
          style={{ animation: 'cubeBeamPulse 3s ease-in-out infinite' }} />
        <path ref={p2Ref} stroke="#60a5fa" strokeWidth="1.4" fill="none"
          style={{ animation: 'cubeBeamPulse 3s 0.7s ease-in-out infinite' }} />
        <path ref={p3Ref} stroke="#93c5fd" strokeWidth="1.1" fill="none"
          style={{ animation: 'cubeBeamPulse 3s 1.2s ease-in-out infinite' }} />
      </svg>

      {/* Cubo CSS 3D — zIndex 6, por debajo de main (zIndex 10) */}
      <div
        ref={cubeRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: CUBE_SIZE, height: CUBE_SIZE,
          zIndex: 6,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <HolographicCube scrollState={scrollState} emissiveRef={emissiveRef} />
      </div>
    </>
  )
}
