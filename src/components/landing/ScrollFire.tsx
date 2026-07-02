import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const FIRE_W    = 70
const FIRE_H    = 120
const GLOW_SIZE = 320
const WAVES     = 2      // 2 oscilaciones → derecha en Pipeline, izquierda en AI Advisor
const PHASE     = 0

interface Props {
  wrapperRef: RefObject<HTMLDivElement | null>
}

export function ScrollFire({ wrapperRef }: Props) {
  const fireRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const fire    = fireRef.current
    const glow    = glowRef.current
    if (!wrapper || !fire || !glow) return

    const amplitude = () => Math.min(160, window.innerWidth * 0.24)

    const placeAt = (rawProg: number) => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const p  = Math.max(0, Math.min(1, rawProg))

      const screenY = 120 + p * (vh - 260)
      const env     = Math.sin(p * Math.PI)
      const xOff    = -env * amplitude() * Math.sin(p * WAVES * Math.PI * 2 + PHASE)
      const screenX = vw / 2 + xOff

      const alpha = rawProg < 0 ? 0
        : rawProg > 1 ? 0
        : Math.min(1, rawProg * 8, (1 - rawProg) * 8)

      // Más intensidad cerca de la zona oscura (inicio)
      const emissive   = Math.max(0, 1 - p / 0.35)
      const glowRadius = Math.round(28 + emissive * 48)
      const glowAlpha  = (0.45 + emissive * 0.40).toFixed(2)

      fire.style.transform  = `translate3d(${screenX - FIRE_W / 2}px, ${screenY - FIRE_H}px, 0)`
      glow.style.transform  = `translate3d(${screenX - GLOW_SIZE / 2}px, ${screenY - GLOW_SIZE * 0.6}px, 0)`
      fire.style.opacity    = String(alpha)
      glow.style.opacity    = String(alpha * 0.9)
      glow.style.background = `radial-gradient(ellipse 60% 80% at 50% 70%, rgba(255,90,10,${glowAlpha}) 0%, rgba(200,40,0,0.18) 45%, transparent 75%)`
      glow.style.filter     = `blur(${glowRadius}px)`
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
    <>
      {/* Halo de calor — zIndex 4, siempre detrás del contenido */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: GLOW_SIZE, height: GLOW_SIZE,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 4,
          opacity: 0,
          willChange: 'transform',
        }}
      />

      {/* Fuego — zIndex 6 */}
      <div
        ref={fireRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: FIRE_W, height: FIRE_H,
          zIndex: 6,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <FireFlame />
      </div>
    </>
  )
}

function FireFlame() {
  return (
    <div style={{ width: FIRE_W, height: FIRE_H, position: 'relative' }}>

      {/* Brasa base — más difusa, se expande */}
      <div style={{
        position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
        width: 72, height: 52,
        background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(220,40,0,0.95) 0%, rgba(180,20,0,0.35) 55%, transparent 100%)',
        filter: 'blur(14px)',
        animation: 'fireGlow 0.6s ease-in-out infinite alternate',
      }} />

      {/* Llama exterior */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 46, height: 95,
        background: 'radial-gradient(ellipse 55% 100% at 50% 96%, #ff2200 0%, #ff5500 35%, rgba(255,100,0,0.25) 70%, transparent 100%)',
        borderRadius: '48% 48% 28% 28% / 55% 55% 45% 45%',
        filter: 'blur(8px)',
        animation: 'fireOuter 0.7s ease-in-out infinite alternate',
        transformOrigin: 'bottom center',
      }} />

      {/* Llama media */}
      <div style={{
        position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
        width: 30, height: 72,
        background: 'radial-gradient(ellipse 50% 100% at 50% 100%, #ff8800 0%, #ff4400 45%, transparent 100%)',
        borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
        filter: 'blur(4px)',
        animation: 'fireMid 0.5s ease-in-out infinite alternate',
        transformOrigin: 'bottom center',
      }} />

      {/* Núcleo caliente */}
      <div style={{
        position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        width: 16, height: 48,
        background: 'radial-gradient(ellipse 50% 100% at 50% 100%, #ffffff 0%, #ffee44 22%, #ffaa00 58%, transparent 100%)',
        borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
        filter: 'blur(2px)',
        animation: 'fireCore 0.4s ease-in-out infinite alternate',
        transformOrigin: 'bottom center',
      }} />

    </div>
  )
}
