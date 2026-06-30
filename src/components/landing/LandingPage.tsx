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

// ── Subcomponentes ─────────────────────────────────────────────────────────────

function CerberusLogo({ size = 26 }: { size?: number }) {
  return (
    <img src="/logo.png" alt="Cerberus" width={size} height={size} style={{ objectFit: 'contain' }} />
  )
}

function LandingScene() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={0.3} />
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
        <Link
          to="/login"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 999,
            background: 'linear-gradient(135deg, #ff4d1c, #ff8a3d)',
            color: '#0a0705', fontWeight: 600, textDecoration: 'none',
            fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em',
            fontSize: 13, textTransform: 'uppercase',
          }}
        >
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
      background: '#04060b',
      overflowX: 'hidden',
    }}>

      {/* ── Fondo fijo: partículas 3D ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <LandingScene />
      </div>

      {/* Overlay — oscurece el fondo a medida que se hace scroll */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(4,6,11,0.1) 0%, rgba(4,6,11,0.65) 100%)',
      }} />

      {/* Grid decorativo fijo */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: 'linear-gradient(rgba(120,160,220,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,220,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
      }} />

      <LandingNavbar />

      <main style={{ position: 'relative', zIndex: 10 }}>

        {/* ════ Hero + Film — frames desde el inicio, texto desaparece con scroll ════ */}
        <HeroFilmSection />

        {/* ════ Ignición — transición (espacio para elemento 3D) ════ */}
        <section id="ignicion" style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '120px 24px',
          background: '#04060b',
        }}>
          {/* Placeholder para el elemento 3D (fuego) — sin renderizado por ahora */}
          <div aria-hidden style={{
            width: 200, height: 320, marginBottom: 64,
            borderRadius: 24,
            border: '1px dashed rgba(255,138,61,0.1)',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(255,138,61,0.05) 0%, transparent 70%)',
          }} />

          <span className="reveal" style={{
            display: 'block', fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, letterSpacing: '0.2em', color: '#ff8a3d',
          }}>
            LA CHISPA
          </span>
          <h2 className="reveal" style={{
            margin: '16px auto 0', maxWidth: 760,
            fontSize: 'clamp(38px, 6vw, 78px)',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
            lineHeight: 0.92, letterSpacing: '0.01em',
            transitionDelay: '0.06s',
          }}>
            De la vigilancia,<br />la acción.
          </h2>
          <p className="reveal" style={{
            margin: '24px auto 0', maxWidth: 520,
            fontSize: 19, lineHeight: 1.55, color: '#b7c6df',
            transitionDelay: '0.12s',
          }}>
            Cuando el guardián detecta, reacciona. Lo que sigue es el motor que lo hace posible —
            encendido en tiempo real sobre tu pipeline.
          </p>
        </section>

        {/* ════ Pipeline ════ */}
        <section id="pipeline" style={{
          minHeight: '120vh',
          display: 'flex', alignItems: 'center',
          padding: '120px 7vw',
          background: 'rgba(4,6,11,0.4)',
        }}>
          <div style={{ maxWidth: 560 }}>
            <span className="reveal" style={{
              display: 'block', fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, letterSpacing: '0.2em', color: '#22d3ee',
            }}>
              01 — EL PIPELINE
            </span>
            <h2 className="reveal" style={{
              margin: '16px 0 18px',
              fontSize: 'clamp(34px, 5vw, 58px)',
              fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
              lineHeight: 0.98, letterSpacing: '0.01em',
              transitionDelay: '0.06s',
            }}>
              Un pipeline,<br />cero brechas.
            </h2>
            <p className="reveal" style={{
              margin: '0 0 44px', fontSize: 18, lineHeight: 1.55,
              color: '#b1c0da', maxWidth: 440,
              transitionDelay: '0.12s',
            }}>
              Del commit al despliegue, CERBERUS intercepta cada cambio y lo somete a control sin intervención manual.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PIPELINE.map((step, i) => (
                <div
                  key={step.n}
                  className="reveal"
                  style={{
                    display: 'flex', gap: 18, padding: '20px 22px',
                    borderRadius: 16,
                    border: '1px solid rgba(34,211,238,0.12)',
                    background: 'rgba(4,14,24,0.55)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transitionDelay: `${0.18 + i * 0.06}s`,
                  }}
                >
                  <div style={{
                    flex: 'none', width: 38, height: 38, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                    color: '#22d3ee',
                    background: 'rgba(34,211,238,0.08)',
                    border: '1px solid rgba(34,211,238,0.22)',
                  }}>
                    {step.n}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 5 }}>{step.title}</div>
                    <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#9fb0cc' }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ Herramientas ════ */}
        <section id="herramientas" style={{
          minHeight: '120vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          textAlign: 'center', padding: '120px 7vw 130px',
          background: 'rgba(4,6,11,0.3)',
        }}>
          <span className="reveal" style={{
            display: 'block', fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, letterSpacing: '0.2em', color: '#22d3ee',
          }}>
            02 — CUATRO MOTORES, UNA DEFENSA
          </span>
          <h2 className="reveal" style={{
            margin: '16px 0 14px',
            fontSize: 'clamp(34px, 5vw, 58px)',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
            lineHeight: 0.98, letterSpacing: '0.01em',
            transitionDelay: '0.06s',
          }}>
            Las tres cabezas, más el rastreador.
          </h2>
          <p className="reveal" style={{
            margin: '0 auto 50px', maxWidth: 560, fontSize: 18, lineHeight: 1.55, color: '#b1c0da',
            transitionDelay: '0.12s',
          }}>
            Herramientas líderes del ecosistema open-source, orquestadas en paralelo y normalizadas en un solo veredicto.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 20, width: '100%', maxWidth: 920,
          }}>
            {TOOLS.map((tool, i) => (
              <div
                key={tool.name}
                className="reveal"
                style={{
                  textAlign: 'left', padding: 28,
                  borderRadius: 20,
                  border: '1px solid rgba(120,160,220,0.10)',
                  background: 'rgba(22,14,8,0.6)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  transitionDelay: `${0.18 + i * 0.06}s`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontWeight: 700, fontSize: 21 }}>{tool.name}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em',
                    padding: '5px 11px', borderRadius: 999,
                    color: '#7fd6ec', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
                  }}>
                    {tool.tag}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: '#9fb0cc' }}>{tool.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════ AI Advisor ════ */}
        <section id="advisor" style={{
          minHeight: '120vh',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '120px 7vw',
          background: 'rgba(4,6,11,0.4)',
        }}>
          <div style={{ maxWidth: 560 }}>
            <span className="reveal" style={{
              display: 'block', fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, letterSpacing: '0.2em', color: '#22d3ee',
            }}>
              03 — AI ADVISOR
            </span>
            <h2 className="reveal" style={{
              margin: '16px 0 18px',
              fontSize: 'clamp(34px, 5vw, 58px)',
              fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
              lineHeight: 0.98, letterSpacing: '0.01em',
              transitionDelay: '0.06s',
            }}>
              No solo detecta.<br />Explica.
            </h2>
            <p className="reveal" style={{
              margin: '0 0 36px', fontSize: 18, lineHeight: 1.55, color: '#b1c0da', maxWidth: 460,
              transitionDelay: '0.12s',
            }}>
              El AI Advisor traduce cada vulnerabilidad a lenguaje claro — contexto, impacto y
              una corrección sugerida — para que tu equipo actúe en minutos, no en horas.
            </p>

            {/* Mock terminal */}
            <div className="reveal" style={{
              borderRadius: 20,
              border: '1px solid rgba(120,160,220,0.12)',
              background: 'rgba(7,11,20,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              transitionDelay: '0.18s',
            }}>
              {/* Barra de título */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 18px',
                borderBottom: '1px solid rgba(120,160,220,0.10)',
                background: 'rgba(12,18,30,0.6)',
              }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#7e90ad' }}>
                  cerberus · advisor
                </span>
              </div>
              {/* Contenido del finding */}
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
                    { label: 'CWE-89',         green: false },
                    { label: 'Semgrep · SAST', green: false },
                    { label: 'Fix con 1 línea', green: true },
                  ].map(({ label, green }) => (
                    <span key={label} style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      padding: '4px 10px', borderRadius: 999,
                      color:       green ? '#5be3a0' : '#ffb37a',
                      background:  green ? 'rgba(40,200,120,0.10)' : 'rgba(255,138,61,0.10)',
                      border:      green ? '1px solid rgba(40,200,120,0.25)' : '1px solid rgba(255,138,61,0.22)',
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
          minHeight: '90vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '120px 24px 80px',
          background: 'rgba(4,6,11,0.3)',
        }}>
          <h2 className="reveal" style={{
            margin: 0,
            fontSize: 'clamp(40px, 7vw, 86px)',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase',
            lineHeight: 0.92, letterSpacing: '0.01em',
            background: 'linear-gradient(180deg, #ffffff, #7fd6ec)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>
            Despliega rápido.<br />Duerme tranquilo.
          </h2>
          <p className="reveal" style={{
            maxWidth: 520, margin: '26px auto 38px',
            fontSize: 19, lineHeight: 1.55, color: '#b7c6df',
            transitionDelay: '0.08s',
          }}>
            Integra CERBERUS en tu pipeline de Kubernetes y deja que el guardián vigile cada release.
          </p>
          <Link
            to="/register"
            className="reveal"
            style={{
              display: 'inline-block',
              padding: '17px 38px', borderRadius: 999,
              background: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
              color: '#04060b', fontWeight: 700, fontSize: 17, textDecoration: 'none',
              boxShadow: '0 14px 50px rgba(34,211,238,0.28)',
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
              transitionDelay: '0.14s',
            }}
          >
            Comenzar gratis
          </Link>
        </section>

        {/* ════ Footer ════ */}
        <footer style={{
          borderTop: '1px solid rgba(120,160,220,0.08)',
          padding: '40px 7vw',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 18,
          background: 'rgba(4,6,11,0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <CerberusLogo size={22} />
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              letterSpacing: '0.18em', fontSize: 17, textTransform: 'uppercase',
            }}>
              CERBERUS
            </span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
            color: '#7e90ad', letterSpacing: '0.06em',
          }}>
            Un proyecto de RiwiLaziness · 2026
          </div>
        </footer>

      </main>
    </div>
  )
}
