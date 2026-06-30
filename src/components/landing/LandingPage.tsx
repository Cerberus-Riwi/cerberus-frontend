import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { GuardianParticles } from '../three/GuardianParticles'
import { HeroFilmSection } from './HeroFilmSection'

// ── Data ──────────────────────────────────────────────────────────────────────

const PIPELINE = [
  { n: '01', title: 'Request',             body: 'Cada commit o pull request dispara el pipeline automáticamente.' },
  { n: '02', title: 'Escaneo en paralelo', body: 'Cuatro motores analizan código, dependencias, contenedores y secretos a la vez.' },
  { n: '03', title: 'Normalización',       body: 'Los hallazgos se unifican, deduplican y priorizan por severidad.' },
  { n: '04', title: 'Quality Gate',        body: 'Una política configurable aprueba o bloquea el despliegue sin intervención manual.' },
  { n: '05', title: 'Rollback',            body: 'Ante un hallazgo crítico, CERBERUS revierte el deploy en Kubernetes al instante.' },
]

const TOOLS = [
  { name: 'Semgrep',    tag: 'SAST',       body: 'Análisis estático del código fuente con reglas a medida para detectar patrones inseguros antes de compilar.' },
  { name: 'OWASP ZAP', tag: 'DAST',       body: 'Pruebas dinámicas sobre la aplicación en ejecución para encontrar fallos explotables en tiempo real.' },
  { name: 'Trivy',     tag: 'CONTAINERS', body: 'Escaneo de imágenes y dependencias en busca de CVEs conocidos en toda la cadena de suministro.' },
  { name: 'Gitleaks',  tag: 'SECRETS',    body: 'Detección de credenciales, tokens y llaves expuestas en el historial del repositorio.' },
]

// ── Tokens de sección clara ────────────────────────────────────────────────────

const LIGHT_BG = 'radial-gradient(ellipse 80% 70% at 50% 50%, #f5f8ff 0%, #e2ecff 40%, #c8d9ff 75%, #a8c0ff 100%)'

// Posiciones y tamaños de los cubos — deterministas para evitar re-renders
const CUBE_DEFS = [
  { left: '6%',  top: '16%', size: 11, delay: '0s',    dur: '7.2s' },
  { left: '83%', top: '11%', size: 9,  delay: '1.4s',  dur: '9.0s' },
  { left: '24%', top: '73%', size: 15, delay: '0.7s',  dur: '6.6s' },
  { left: '90%', top: '64%', size: 10, delay: '2.2s',  dur: '8.1s' },
  { left: '57%', top: '87%', size: 8,  delay: '1.1s',  dur: '7.8s' },
  { left: '44%', top: '7%',  size: 13, delay: '3.0s',  dur: '6.3s' },
  { left: '14%', top: '46%', size: 7,  delay: '1.8s',  dur: '8.7s' },
  { left: '72%', top: '38%', size: 12, delay: '0.4s',  dur: '7.5s' },
]

function FloatingCubes() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {CUBE_DEFS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.left, top: c.top,
            width: c.size, height: c.size,
            border: '1px solid rgba(37, 99, 235, 0.32)',
            background: 'rgba(37, 99, 235, 0.06)',
            borderRadius: 2,
            animation: `cubeFloat ${c.dur} ${c.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

// Capas de profundidad + cubos reutilizables para secciones claras
function SectionDepth() {
  return (
    <>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'linear-gradient(180deg, #04060b 0%, rgba(4,6,11,0) 13%, rgba(4,6,11,0) 87%, #04060b 100%)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(255,255,255,0.55) 0%, transparent 100%)',
      }} />
      <FloatingCubes />
    </>
  )
}

// ── Subcomponentes ─────────────────────────────────────────────────────────────

function CerberusLogo({ size = 26 }: { size?: number }) {
  return (
    <img src="/logo.png" alt="Cerberus" width={size} height={size} style={{ objectFit: 'contain' }} />
  )
}

function LandingScene() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: false, failIfMajorPerformanceCaveat: false }}
    >
      <GuardianParticles mode="register" />
    </Canvas>
  )
}

function LandingNavbar() {
  return (
    <nav id="landing-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 40px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      background: 'linear-gradient(180deg, rgba(4,6,11,0.82), rgba(4,6,11,0))',
      borderBottom: '1px solid rgba(120,160,220,0.06)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <CerberusLogo />
        <span style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 21,
          letterSpacing: '0.2em', color: '#e9eef8', textTransform: 'uppercase',
        }}>
          CERBERUS
        </span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 34, fontSize: 14, color: '#aebdd6' }}>
        <a href="#pipeline"     style={{ color: 'inherit', textDecoration: 'none' }}>Pipeline</a>
        <a href="#herramientas" style={{ color: 'inherit', textDecoration: 'none' }}>Herramientas</a>
        <a href="#advisor"      style={{ color: 'inherit', textDecoration: 'none' }}>AI Advisor</a>
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 18px', borderRadius: 999,
          background: 'linear-gradient(135deg, #ff4d1c, #ff8a3d)',
          color: '#0a0705', fontWeight: 600, textDecoration: 'none',
          fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em',
          fontSize: 13, textTransform: 'uppercase',
        }}>
          Iniciar sesión
        </Link>
      </div>
    </nav>
  )
}

// ── Hook reveal ───────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── LandingPage ───────────────────────────────────────────────────────────────

export function LandingPage() {
  useReveal()

  return (
    <div style={{
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      color: '#e9eef8',
      WebkitFontSmoothing: 'antialiased',
    }}>

      {/* Fondo fijo: partículas 3D */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <LandingScene />
      </div>

      {/* Overlay sutil — no bloquea las partículas en secciones inferiores */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(4,6,11,0.08) 0%, rgba(4,6,11,0.32) 100%)',
      }} />

      {/* Grid decorativo fijo */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: 'linear-gradient(rgba(120,160,220,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,220,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
      }} />

      <LandingNavbar />

      <main style={{ position: 'relative', zIndex: 10 }}>

        {/* ════ Hero + Film ════ */}
        <HeroFilmSection />

        {/* ════ Ignición ════ */}
        <section id="ignicion" style={{
          minHeight: '100vh', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '120px 24px',
          background: LIGHT_BG,
        }}>
          <SectionDepth />

          <div aria-hidden style={{
            position: 'relative', zIndex: 2,
            width: 200, height: 320, margin: '0 auto 64px',
            borderRadius: 24,
            border: '1px solid rgba(60,100,220,0.15)',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(80,120,255,0.08) 0%, transparent 70%)',
            boxShadow: '0 24px 64px rgba(60,100,220,0.14), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
          }} />

          <span className="reveal" style={{
            position: 'relative', zIndex: 2,
            display: 'block', fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, letterSpacing: '0.2em', color: '#3b5fb8',
          }}>
            LA CHISPA
          </span>
          <h2 className="reveal" style={{
            position: 'relative', zIndex: 2,
            margin: '16px auto 0', maxWidth: 760,
            fontSize: 'clamp(38px, 6vw, 78px)',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
            lineHeight: 0.92, letterSpacing: '0.01em',
            color: '#0d1832',
            textShadow: '0 8px 40px rgba(60,100,220,0.22), 0 2px 10px rgba(0,0,0,0.1)',
            transitionDelay: '0.06s',
          }}>
            De la vigilancia,<br />la acción.
          </h2>
          <p className="reveal" style={{
            position: 'relative', zIndex: 2,
            margin: '24px auto 0', maxWidth: 520,
            fontSize: 19, lineHeight: 1.55, color: '#2c4472',
            textShadow: '0 2px 12px rgba(60,100,220,0.1)',
            transitionDelay: '0.12s',
          }}>
            Cuando el guardián detecta, reacciona. Lo que sigue es el motor que lo hace posible —
            encendido en tiempo real sobre tu pipeline.
          </p>
        </section>

        {/* ════ Pipeline ════ */}
        <section id="pipeline" style={{
          minHeight: '120vh', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center',
          padding: '120px 7vw',
          background: LIGHT_BG,
        }}>
          <SectionDepth />
          <div style={{ maxWidth: 560, position: 'relative', zIndex: 2 }}>
            <span className="reveal" style={{
              display: 'block', fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, letterSpacing: '0.2em', color: '#1b6cb8',
            }}>
              01 — EL PIPELINE
            </span>
            <h2 className="reveal" style={{
              margin: '16px 0 18px',
              fontSize: 'clamp(34px, 5vw, 58px)',
              fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
              lineHeight: 0.98, letterSpacing: '0.01em',
              color: '#0d1832',
              textShadow: '0 8px 40px rgba(60,100,220,0.22), 0 2px 10px rgba(0,0,0,0.1)',
              transitionDelay: '0.06s',
            }}>
              Un pipeline,<br />cero brechas.
            </h2>
            <p className="reveal" style={{
              margin: '0 0 44px', fontSize: 18, lineHeight: 1.55,
              color: '#2c4472', maxWidth: 440,
              transitionDelay: '0.12s',
            }}>
              Del commit al despliegue, CERBERUS intercepta cada cambio y lo somete a control sin intervención manual.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PIPELINE.map((step, i) => (
                <div key={step.n} className="reveal" style={{
                  display: 'flex', gap: 18, padding: '20px 22px',
                  borderRadius: 16,
                  border: '1px solid rgba(60,100,200,0.18)',
                  background: 'rgba(255,255,255,0.62)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(60,100,200,0.08)',
                  transitionDelay: `${0.18 + i * 0.06}s`,
                }}>
                  <div style={{
                    flex: 'none', width: 38, height: 38, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                    color: '#2563eb',
                    background: 'rgba(37,99,235,0.1)',
                    border: '1px solid rgba(37,99,235,0.25)',
                  }}>
                    {step.n}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 5, color: '#0d1832' }}>{step.title}</div>
                    <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#3d5580' }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ Herramientas ════ */}
        <section id="herramientas" style={{
          minHeight: '120vh', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          textAlign: 'center', padding: '120px 7vw 130px',
          background: LIGHT_BG,
        }}>
          <SectionDepth />
          <span className="reveal" style={{
            position: 'relative', zIndex: 2,
            display: 'block', fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, letterSpacing: '0.2em', color: '#1b6cb8',
          }}>
            02 — CUATRO MOTORES, UNA DEFENSA
          </span>
          <h2 className="reveal" style={{
            position: 'relative', zIndex: 2,
            margin: '16px 0 14px',
            fontSize: 'clamp(34px, 5vw, 58px)',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
            lineHeight: 0.98, letterSpacing: '0.01em',
            color: '#0d1832',
            textShadow: '0 8px 40px rgba(60,100,220,0.22), 0 2px 10px rgba(0,0,0,0.1)',
            transitionDelay: '0.06s',
          }}>
            Las tres cabezas, más el rastreador.
          </h2>
          <p className="reveal" style={{
            position: 'relative', zIndex: 2,
            margin: '0 auto 50px', maxWidth: 560, fontSize: 18, lineHeight: 1.55, color: '#2c4472',
            transitionDelay: '0.12s',
          }}>
            Herramientas líderes del ecosistema open-source, orquestadas en paralelo y normalizadas en un solo veredicto.
          </p>

          <div style={{
            position: 'relative', zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 20, width: '100%', maxWidth: 920,
          }}>
            {TOOLS.map((tool, i) => (
              <div key={tool.name} className="reveal" style={{
                textAlign: 'left', padding: 28,
                borderRadius: 20,
                border: '1px solid rgba(60,100,200,0.15)',
                background: 'rgba(255,255,255,0.62)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: '0 4px 24px rgba(60,100,200,0.09)',
                transitionDelay: `${0.18 + i * 0.06}s`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontWeight: 700, fontSize: 21, color: '#0d1832' }}>{tool.name}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em',
                    padding: '5px 11px', borderRadius: 999,
                    color: '#2563eb', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
                  }}>
                    {tool.tag}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: '#3d5580' }}>{tool.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════ AI Advisor ════ */}
        <section id="advisor" style={{
          minHeight: '120vh', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '120px 7vw',
          background: LIGHT_BG,
        }}>
          <SectionDepth />
          <div style={{ maxWidth: 560, position: 'relative', zIndex: 2 }}>
            <span className="reveal" style={{
              display: 'block', fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, letterSpacing: '0.2em', color: '#1b6cb8',
            }}>
              03 — AI ADVISOR
            </span>
            <h2 className="reveal" style={{
              margin: '16px 0 18px',
              fontSize: 'clamp(34px, 5vw, 58px)',
              fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
              lineHeight: 0.98, letterSpacing: '0.01em',
              color: '#0d1832',
              textShadow: '0 8px 40px rgba(60,100,220,0.22), 0 2px 10px rgba(0,0,0,0.1)',
              transitionDelay: '0.06s',
            }}>
              No solo detecta.<br />Explica.
            </h2>
            <p className="reveal" style={{
              margin: '0 0 36px', fontSize: 18, lineHeight: 1.55, color: '#2c4472', maxWidth: 460,
              transitionDelay: '0.12s',
            }}>
              El AI Advisor traduce cada vulnerabilidad a lenguaje claro — contexto, impacto y
              una corrección sugerida — para que tu equipo actúe en minutos, no en horas.
            </p>

            {/* Terminal — conserva estilo oscuro, se ve bien sobre fondo claro */}
            <div className="reveal" style={{
              borderRadius: 20,
              border: '1px solid rgba(120,160,220,0.18)',
              background: 'rgba(7,11,20,0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)',
              transitionDelay: '0.18s',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 18px',
                borderBottom: '1px solid rgba(120,160,220,0.10)',
                background: 'rgba(12,18,30,0.7)',
              }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#7e90ad' }}>
                  cerberus · advisor
                </span>
              </div>
              <div style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    padding: '5px 10px', borderRadius: 6,
                    color: '#ff6b6b', background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.3)',
                  }}>CRÍTICA</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, color: '#dfe7f5' }}>
                    SQL Injection
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6b7d99' }}>
                    auth/login.py:42
                  </span>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.6, color: '#aebdd6' }}>
                  La consulta concatena{' '}
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", color: '#22d3ee' }}>request.username</code>{' '}
                  directamente al SQL. Un atacante podría inyectar comandos y leer toda la tabla de usuarios.
                </p>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, lineHeight: 1.7,
                  padding: 14, borderRadius: 10, background: '#070b14',
                  border: '1px solid rgba(120,160,220,0.10)',
                }}>
                  <div style={{ color: '#ff7a85' }}>{`- query = f"SELECT * FROM users WHERE name='{username}'"`}</div>
                  <div style={{ color: '#5be3a0' }}>{`+ cursor.execute("SELECT * FROM users WHERE name=%s", [username])`}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {[
                    { label: 'CWE-89',          green: false },
                    { label: 'Semgrep · SAST',  green: false },
                    { label: 'Fix con 1 línea', green: true  },
                  ].map(({ label, green }) => (
                    <span key={label} style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      padding: '4px 10px', borderRadius: 999,
                      color:      green ? '#5be3a0' : '#ffb37a',
                      background: green ? 'rgba(40,200,120,0.10)' : 'rgba(255,138,61,0.10)',
                      border:     green ? '1px solid rgba(40,200,120,0.25)' : '1px solid rgba(255,138,61,0.22)',
                    }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ CTA final ════ */}
        <section id="demo" style={{
          minHeight: '90vh', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '120px 24px 80px',
          background: LIGHT_BG,
        }}>
          <SectionDepth />
          <h2 className="reveal" style={{
            position: 'relative', zIndex: 2, margin: 0,
            fontSize: 'clamp(40px, 7vw, 86px)',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
            lineHeight: 0.92, letterSpacing: '0.01em',
            color: '#0d1832',
            textShadow: '0 8px 40px rgba(60,100,220,0.25), 0 2px 10px rgba(0,0,0,0.1)',
          }}>
            Despliega rápido.<br />Duerme tranquilo.
          </h2>
          <p className="reveal" style={{
            position: 'relative', zIndex: 2,
            maxWidth: 520, margin: '26px auto 38px',
            fontSize: 19, lineHeight: 1.55, color: '#2c4472',
            transitionDelay: '0.08s',
          }}>
            Integra CERBERUS en tu pipeline de Kubernetes y deja que el guardián vigile cada release.
          </p>
          <Link to="/register" className="reveal" style={{
            position: 'relative', zIndex: 2,
            display: 'inline-block',
            padding: '17px 38px', borderRadius: 999,
            background: 'linear-gradient(135deg, #2563eb, #22d3ee)',
            color: '#f0f7ff', fontWeight: 700, fontSize: 17, textDecoration: 'none',
            boxShadow: '0 14px 50px rgba(37,99,235,0.35)',
            fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
            transitionDelay: '0.14s',
          }}>
            Comenzar gratis
          </Link>
        </section>

        {/* ════ Footer ════ */}
        <footer style={{
          position: 'relative', overflow: 'hidden',
          borderTop: '1px solid rgba(60,100,200,0.15)',
          padding: '40px 7vw',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 18,
          background: LIGHT_BG,
        }}>
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(180deg, #04060b 0%, rgba(4,6,11,0) 40%)',
          }} />
          <FloatingCubes />
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 11 }}>
            <CerberusLogo size={22} />
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              letterSpacing: '0.18em', fontSize: 17, textTransform: 'uppercase', color: '#0d1832',
            }}>
              CERBERUS
            </span>
          </div>
          <div style={{
            position: 'relative', zIndex: 2,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
            color: '#3d5580', letterSpacing: '0.06em',
          }}>
            Un proyecto de RiwiLaziness · 2026
          </div>
        </footer>

      </main>
    </div>
  )
}
