import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 108

export function FilmSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas  = canvasRef.current
    const section = sectionRef.current
    const caption = captionRef.current
    if (!canvas || !section || !caption) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const frames: HTMLImageElement[] = []
    let currentIdx = 0
    let sized = false

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width  = Math.round(window.innerWidth  * dpr)
      canvas!.height = Math.round(window.innerHeight * dpr)
      sized = true
      drawFrame(currentIdx)
    }

    function drawFrame(idx: number) {
      currentIdx = idx
      const img = frames[idx]
      if (!img?.complete || !img.naturalWidth || !sized) return
      const W = canvas!.width
      const H = canvas!.height
      ctx!.clearRect(0, 0, W, H)
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
      const w = img.naturalWidth  * scale
      const h = img.naturalHeight * scale
      ctx!.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
    }

    // Preload frames — el primero dispara sizeCanvas y el primer draw
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.onload = () => {
        if (i === 0) { sizeCanvas(); drawFrame(0) }
      }
      img.src = `/frames/cerberusframe${String(i + 1).padStart(4, '0')}.jpg`
      frames.push(img)
    }

    sizeCanvas()

    // ── ScrollTrigger: scrub de frames ──
    const stFrames = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate(self) {
        const idx = Math.round(self.progress * (FRAME_COUNT - 1))
        drawFrame(Math.max(0, Math.min(FRAME_COUNT - 1, idx)))
      },
    })

    // ── ScrollTrigger: caption fade in / fade out ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: '28% top',
        end: '70% top',
        scrub: true,
      },
    })
    tl.fromTo(caption,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
    ).to(caption,
      { opacity: 0, y: -20, ease: 'power2.in', duration: 0.7 },
      '+=0.3',
    )

    window.addEventListener('resize', sizeCanvas)
    return () => {
      stFrames.kill()
      tl.scrollTrigger?.kill()
      tl.kill()
      window.removeEventListener('resize', sizeCanvas)
    }
  }, [])

  return (
    <div ref={sectionRef} style={{ position: 'relative', height: '340vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#04060b',
      }}>
        {/* Canvas de secuencia de frames */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            display: 'block',
            background: '#04060b',
          }}
        />

        {/* Fade superior e inferior */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(4,6,11,0.65) 0%, rgba(4,6,11,0.02) 22%, rgba(4,6,11,0.02) 68%, rgba(4,6,11,0.97) 100%)',
        }} />

        {/* Caption — controlado por GSAP */}
        <div ref={captionRef} style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', padding: '0 24px', maxWidth: 760,
          opacity: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, letterSpacing: '0.22em', color: '#22d3ee',
            textTransform: 'uppercase',
          }}>
            En movimiento
          </span>
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '0.01em',
            color: '#ffffff',
            textShadow: '0 0 60px rgba(0,0,0,0.7)',
          }}>
            El guardián, en acción.
          </h2>
          <p style={{
            margin: 0, maxWidth: 480,
            fontSize: 17, lineHeight: 1.55, color: '#c3d1e8',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            Cada fotograma avanza con tu scroll. Recórrelo a tu ritmo.
          </p>
        </div>
      </div>
    </div>
  )
}
