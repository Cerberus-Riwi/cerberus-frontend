import { useRef, useLayoutEffect, useEffect, useState } from 'react'
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
  const rootRef  = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isLogin  = mode === 'login'

  // Estado de la animación: 'idle' → 'out' (fade out) → 'in' (fade in) → 'idle'
  const [animState, setAnimState] = useState<'idle' | 'out' | 'in'>('idle')

  // Aplica los CSS vars de tema en el elemento raíz — todos los hijos los heredan
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    el.style.setProperty('--accent', THEME[mode].accent)
    el.style.setProperty('--accent2', THEME[mode].accent2)
  }, [mode])

  // Dispara la secuencia: fade-out (300ms) → slide en CSS → fade-in (300ms)
  useEffect(() => {
    setAnimState('out')
    const tIn   = setTimeout(() => setAnimState('in'),   280)
    const tIdle = setTimeout(() => setAnimState('idle'), 700)
    return () => { clearTimeout(tIn); clearTimeout(tIdle) }
  }, [mode])

  const switchTo = (m: AuthMode) => navigate({ to: `/${m}` })

  // Opacidad de los paneles durante la transición
  const panelOpacity = animState === 'out' ? 0 : 1
  const panelScale   = animState === 'out' ? 0.97 : 1
  const panelTransition = animState === 'idle'
    ? 'none'
    : 'opacity 0.28s ease, transform 0.28s ease'

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
      {/* Ambient glow que sigue al panel de formulario */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(60% 60% at ${isLogin ? '75%' : '25%'} 55%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 60%)`,
        transition: 'background 0.85s ease',
      }} />

      {/* Grid decorativo */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
        backgroundImage: 'linear-gradient(rgba(120,160,220,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,220,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
        maskImage: 'radial-gradient(80% 80% at 50% 40%, #000 0%, transparent 80%)',
      }} />

      <AuthNavbar mode={mode} onSwitch={switchTo} />

      {/* Stage 3D — desliza entre izquierda y derecha según el modo */}
      <div style={{
        position: 'absolute', top: 80, bottom: 0, width: '50%',
        left: isLogin ? '0%' : '50%',
        transition: 'left 0.85s cubic-bezier(.76,0,.24,1)',
        zIndex: 5,
        opacity: panelOpacity,
        transform: `scale(${panelScale})`,
        // La transición del slide (left) siempre activa; fade solo durante animación
        ...(animState !== 'idle' ? { transition: 'left 0.85s cubic-bezier(.76,0,.24,1), opacity 0.28s ease, transform 0.28s ease' } : { transition: 'left 0.85s cubic-bezier(.76,0,.24,1)' }),
      }}>
        {/* Glow detrás del guardián */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(46% 46% at 50% 46%, color-mix(in srgb, var(--accent) 20%, transparent) 0%, transparent 70%)',
          transition: 'background 0.85s ease',
        }} />
        <GuardianScene mode={mode} />
      </div>

      {/* Panel del formulario — desliza en dirección opuesta al stage */}
      <div style={{
        position: 'absolute', top: 80, bottom: 0, width: '50%',
        left: isLogin ? '50%' : '0%',
        transition: 'left 0.85s cubic-bezier(.76,0,.24,1)',
        zIndex: 6,
        // Fondo glass/burbuja que resalta el formulario sobre el stage 3D
        background: 'rgba(4, 6, 11, 0.5)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderLeft: isLogin ? '1px solid rgba(120,160,220,0.08)' : 'none',
        borderRight: isLogin ? 'none' : '1px solid rgba(120,160,220,0.08)',
        ...(animState !== 'idle' ? { transition: 'left 0.85s cubic-bezier(.76,0,.24,1), opacity 0.28s ease, transform 0.28s ease' } : { transition: 'left 0.85s cubic-bezier(.76,0,.24,1)' }),
        opacity: panelOpacity,
        transform: `scale(${panelScale})`,
      }}>
        {/* Login form */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 24,
          opacity: isLogin ? 1 : 0,
          pointerEvents: isLogin ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
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
          transition: 'opacity 0.4s ease',
        }}>
          <RegisterForm onSwitchToLogin={() => switchTo('login')} />
        </div>
      </div>
    </div>
  )
}
