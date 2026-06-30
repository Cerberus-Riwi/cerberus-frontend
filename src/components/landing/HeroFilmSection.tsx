import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HeroFilmSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const video   = videoRef.current
    const hero    = heroRef.current
    if (!section || !video || !hero) return

    const navbar = document.getElementById('landing-nav')

    // ── Navbar: fade simple ──
    const tlNavFade = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: '10% top', scrub: true },
    })
    if (navbar) tlNavFade.to(navbar, { opacity: 0, ease: 'none' })

    // ── Hero: sube y se desvanece ──
    const tlHeroFade = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: '13% top', scrub: 1.2 },
    })
    tlHeroFade.to(hero, { opacity: 0, y: -70, ease: 'power1.in' })

    // ── Video scrub: mapea scroll progress → currentTime ──
    const stVideo = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate(self) {
        if (video.readyState >= 2 && video.duration) {
          video.currentTime = self.progress * video.duration
        }
      },
    })

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      tlNavFade.scrollTrigger?.kill(); tlNavFade.kill()
      tlHeroFade.scrollTrigger?.kill(); tlHeroFade.kill()
      stVideo.kill()
    }
  }, [])

  return (
    <div ref={sectionRef} style={{ position: 'relative', height: '500vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden',
        background: '#04060b',
      }}>
        {/* Video de frames — sustituye el canvas 2D */}
        <video
          ref={videoRef}
          src="/cerberus-hero.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />

        {/* Gradiente — funde navbar y pie del frame */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(4,6,11,0.58) 0%, rgba(4,6,11,0) 26%, rgba(4,6,11,0) 68%, rgba(4,6,11,0.97) 100%)',
        }} />

        {/* Contenido hero */}
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
