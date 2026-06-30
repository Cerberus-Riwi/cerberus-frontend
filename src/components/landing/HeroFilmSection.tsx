import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 108

export function HeroFilmSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas  = canvasRef.current
    const hero    = heroRef.current
    if (!section || !canvas || !hero) return

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

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.onload = () => {
        if (i === 0) { sizeCanvas(); drawFrame(0) }
      }
      img.src = `/frames/cerberusframe${String(i + 1).padStart(4, '0')}.jpg`
      frames.push(img)
    }

    sizeCanvas()

    const navbar = document.getElementById('landing-nav')

    // ── Hero text + navbar: desaparecen en el primer 10% del scroll ──
    const tlFade = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '10% top',
        scrub: true,
      },
    })
    tlFade.to([hero, navbar].filter(Boolean), { opacity: 0, ease: 'none' })

    // ── Navbar: vuelve al terminar la sección ──
    const tlNavBack = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: '88% top',
        end: 'bottom top',
        scrub: true,
      },
    })
    if (navbar) tlNavBack.to(navbar, { opacity: 1, ease: 'none' })

    // ── Frame scrub: cubre el 100% de la sección ──
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

    window.addEventListener('resize', sizeCanvas)
    return () => {
      tlFade.scrollTrigger?.kill()
      tlFade.kill()
      tlNavBack.scrollTrigger?.kill()
      tlNavBack.kill()
      stFrames.kill()
      window.removeEventListener('resize', sizeCanvas)
    }
  }, [])

  return (
    <div ref={sectionRef} style={{ position: 'relative', height: '500vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden',
        background: '#04060b',
      }}>
        {/* Canvas de frames — capa base */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            display: 'block',
          }}
        />

        {/* Gradiente — funde navbar y pie del frame */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(4,6,11,0.58) 0%, rgba(4,6,11,0) 26%, rgba(4,6,11,0) 68%, rgba(4,6,11,0.97) 100%)',
        }} />

        {/* Contenido hero — se desvanece al hacer scroll */}
        <div ref={heroRef} style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '140px 24px 90px',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7px 16px', borderRadius: 999,
            border: '1px solid rgba(255,138,61,0.25)',
            background: 'rgba(20,10,4,0.5)',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            letterSpacing: '0.22em', color: '#ffb37a',
            marginBottom: 26,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#ff8a3d', boxShadow: '0 0 12px #ff8a3d',
              display: 'inline-block',
              animation: 'blink 2.4s infinite',
            }} />
            DEVSECOPS · KUBERNETES-NATIVE
          </div>

          {/* Título */}
          <h1 style={{
            margin: 0,
            fontFamily: "'Oswald', sans-serif",
            fontSize: 'clamp(74px, 13vw, 196px)',
            fontWeight: 700, lineHeight: 0.86, letterSpacing: '0.02em', textTransform: 'uppercase',
            background: 'linear-gradient(180deg, #ffffff 26%, #ffb37a)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            textShadow: '0 0 80px rgba(255,138,61,0.22)',
          }}>
            CERBERUS
          </h1>

          <p style={{
            maxWidth: 640, margin: '28px auto 0',
            fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.55, color: '#b7c6df',
          }}>
            El guardián de tres cabezas para tu pipeline. SAST, DAST y detección de secretos en paralelo,
            con <strong style={{ color: '#e9eef8', fontWeight: 600 }}>Quality Gate</strong> automatizado
            y <strong style={{ color: '#e9eef8', fontWeight: 600 }}>rollback</strong> nativo en
            Kubernetes — seguridad que no frena el deploy.
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" style={{
              padding: '15px 30px', borderRadius: 999,
              background: 'linear-gradient(135deg, #ff4d1c, #ff8a3d)',
              color: '#0a0705', fontWeight: 600, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 10px 40px rgba(255,138,61,0.28)',
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Comenzar ahora
            </Link>
            <a href="#pipeline" style={{
              padding: '15px 30px', borderRadius: 999,
              border: '1px solid rgba(255,138,61,0.22)',
              background: 'rgba(20,10,4,0.5)',
              color: '#e9eef8', fontWeight: 600, fontSize: 16, textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Ver el pipeline →
            </a>
          </div>

          <div style={{
            display: 'flex', gap: 30, marginTop: 54, flexWrap: 'wrap', justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, letterSpacing: '0.1em', color: '#7e6050',
          }}>
            <span>SAST · DAST · SECRETS</span>
            <span style={{ color: '#3b1f10' }}>|</span>
            <span>QUALITY GATE AUTOMÁTICO</span>
            <span style={{ color: '#3b1f10' }}>|</span>
            <span>ROLLBACK EN K8S</span>
          </div>

          <div style={{ marginTop: 74, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: '0.24em', color: '#7e6050',
            }}>SCROLL</span>
            <div style={{
              width: 1, height: 42,
              background: 'linear-gradient(#ff8a3d, transparent)',
              animation: 'scrollCue 2.2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
