import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

export interface CubeScrollState { velocity: number }

const FACE = 84
const HALF = FACE / 2

const TRANSFORMS = [
  `translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
  `rotateY(90deg)  translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateX(90deg)  translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
]

interface Props {
  scrollState: RefObject<CubeScrollState>
  emissiveRef: RefObject<number>
}

export function HolographicCube({ scrollState, emissiveRef }: Props) {
  const cubeRef  = useRef<HTMLDivElement>(null)
  const facesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cube = cubeRef.current
    if (!cube) return

    let raf: number
    let rX = 18, rY = 0, rZ = 6

    const tick = () => {
      const vel = Math.abs(scrollState.current?.velocity ?? 0)
      const e   = Math.max(0, Math.min(1, emissiveRef.current))
      const spd = 0.42 + vel * 7
      rY += spd
      rX += spd * 0.28
      rZ += spd * 0.09
      cube.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(${rZ}deg)`

      // Brillo dinámico de cada cara: alto al emerger de la oscuridad, decae con el scroll
      const innerA  = (0.18 + e * 0.65).toFixed(2)
      const innerPx = Math.round(12 + e * 24)
      const outerA  = (0.06 + e * 0.46).toFixed(2)
      const outerPx = Math.round(4 + e * 24)
      const borderA = (0.68 + e * 0.32).toFixed(2)

      const shadow = `inset 0 0 ${innerPx}px rgba(59,130,246,${innerA}), 0 0 ${outerPx}px rgba(59,130,246,${outerA})`
      facesRef.current.forEach(f => {
        if (!f) return
        f.style.boxShadow   = shadow
        f.style.borderColor = `rgba(96,165,250,${borderA})`
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollState, emissiveRef])

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      perspective: 460,
    }}>
      <div
        ref={cubeRef}
        style={{
          width: FACE, height: FACE,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {TRANSFORMS.map((t, i) => (
          <div
            key={i}
            ref={el => { facesRef.current[i] = el }}
            style={{
              position: 'absolute',
              width: FACE, height: FACE,
              boxSizing: 'border-box',
              transform: t,
              background: 'rgba(8, 22, 88, 0.60)',
              border: '1.5px solid rgba(96, 165, 250, 0.68)',
              backfaceVisibility: 'visible',
            }}
          />
        ))}
      </div>
    </div>
  )
}
