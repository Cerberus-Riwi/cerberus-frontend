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
  const isLogin  = mode === 'login'

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
      {/* Canvas full-screen — nunca se oculta ni se mueve */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <GuardianScene mode={mode} />
      </div>

      {/* Ambient glow que sigue al panel */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: `radial-gradient(60% 60% at ${isLogin ? '25%' : '75%'} 55%, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 60%)`,
        transition: 'background 0.85s ease',
      }} />

      {/* Grid decorativo */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.5,
        backgroundImage: 'linear-gradient(rgba(120,160,220,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,220,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
        maskImage: 'radial-gradient(80% 80% at 50% 40%, #000 0%, transparent 80%)',
      }} />

      <AuthNavbar mode={mode} onSwitch={switchTo} />

      {/* Cortina de formulario — desliza sobre el 3D sin tocarlo */}
      <div style={{
        position: 'absolute',
        top: 80, bottom: 0, width: '50%',
        left: isLogin ? '50%' : '0%',
        transition: 'left 0.82s cubic-bezier(.76,0,.24,1)',
        zIndex: 10,
        background: 'rgba(4, 6, 11, 0.38)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        borderLeft: isLogin ? '1px solid rgba(255,255,255,0.06)' : 'none',
        borderRight: isLogin ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Línea de acento en el borde interior */}
        <div aria-hidden style={{
          position: 'absolute', top: '10%', bottom: '10%', width: 1,
          left: isLogin ? 0 : 'auto',
          right: isLogin ? 'auto' : 0,
          background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)',
          opacity: 0.35,
          transition: 'left 0.82s cubic-bezier(.76,0,.24,1), right 0.82s cubic-bezier(.76,0,.24,1), background 0.85s ease',
        }} />

        {/* Login form */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 24,
          opacity: isLogin ? 1 : 0,
          pointerEvents: isLogin ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}>
          <LoginForm onSwitchToRegister={() => switchTo('register')} />
        </div>

        {/* Register form */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 24,
          opacity: isLogin ? 0 : 1,
          pointerEvents: isLogin ? 'none' : 'auto',
          transition: 'opacity 0.35s ease',
        }}>
          <RegisterForm onSwitchToLogin={() => switchTo('login')} />
        </div>
      </div>
    </div>
  )
}
