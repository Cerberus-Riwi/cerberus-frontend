import { useRef, useLayoutEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { AuthMode } from '../../types/cerberus'
import { AuthNavbar } from './AuthNavbar'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { GuardianScene } from '../three/GuardianScene'

interface AuthPageProps {
  mode: AuthMode
}

const THEME = {
  login:    { accent: '#22d3ee', accent2: '#3b82f6' },
  register: { accent: '#ff8a3d', accent2: '#ff4d1c' },
}

export function AuthPage({ mode }: AuthPageProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  // Aplica los colores del tema como CSS custom properties en el contenedor raíz.
  // Los componentes hijo los leen con var(--accent) sin necesitar props adicionales.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    el.style.setProperty('--accent', THEME[mode].accent)
    el.style.setProperty('--accent2', THEME[mode].accent2)
  }, [mode])

  const switchTo = (m: AuthMode) => navigate({ to: `/${m}` })

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(120% 90% at 50% -10%, #0a1424 0%, #04060b 55%, #060406 100%)',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        color: '#e9eef8',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Ambient glow — sigue al panel de formulario */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(60% 60% at ${isLogin ? '75%' : '25%'} 55%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 60%)`,
          transition: 'background 0.8s ease',
        }}
      />

      {/* Grid decorativo */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.5,
          backgroundImage: 'linear-gradient(rgba(120,160,220,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,220,0.04) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(80% 80% at 50% 40%, #000 0%, transparent 80%)',
        }}
      />

      <AuthNavbar mode={mode} onSwitch={switchTo} />

      {/* Stage 3D — desliza izq↔der según el modo */}
      <div style={{
        position: 'absolute',
        top: 80,
        bottom: 0,
        width: '50%',
        left: isLogin ? '0%' : '50%',
        transition: 'left 0.85s cubic-bezier(.76,0,.24,1)',
        zIndex: 5,
      }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(46% 46% at 50% 46%, color-mix(in srgb, var(--accent) 20%, transparent) 0%, transparent 70%)',
            transition: 'background 0.8s ease',
          }}
        />
        <GuardianScene mode={mode} />
        <div style={{ position: 'absolute', left: 40, bottom: 42, pointerEvents: 'none' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.24em', color: 'var(--accent)', textTransform: 'uppercase', transition: 'color 0.6s ease' }}>
            ▎ Guardián · low-poly
          </div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 26, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 6 }}>
            El guardián no duerme
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#5d7095', marginTop: 8 }}>
            mueve el cursor — las cabezas te siguen
          </div>
        </div>
      </div>

      {/* Panel de formulario — desliza der↔izq según el modo */}
      <div style={{
        position: 'absolute',
        top: 80,
        bottom: 0,
        width: '50%',
        left: isLogin ? '50%' : '0%',
        transition: 'left 0.85s cubic-bezier(.76,0,.24,1)',
        zIndex: 6,
      }}>
        {/* Login form */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          opacity: isLogin ? 1 : 0,
          pointerEvents: isLogin ? 'auto' : 'none',
          transform: `translateY(${isLogin ? 0 : 18}px)`,
          transition: 'opacity 0.55s ease, transform 0.55s ease',
        }}>
          <LoginForm onSwitchToRegister={() => switchTo('register')} />
        </div>

        {/* Register form */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          opacity: isLogin ? 0 : 1,
          pointerEvents: isLogin ? 'none' : 'auto',
          transform: `translateY(${isLogin ? 18 : 0}px)`,
          transition: 'opacity 0.55s ease, transform 0.55s ease',
        }}>
          <RegisterForm onSwitchToLogin={() => switchTo('login')} />
        </div>
      </div>
    </div>
  )
}
