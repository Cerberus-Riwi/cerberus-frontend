import { useNavigate } from '@tanstack/react-router'
import type { AuthMode } from '../../types/cerberus'
import { COLORS, FONTS, RADIUS } from '../../lib/theme'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { Seal } from '../ui/Seal'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

interface AuthPageProps {
  mode: AuthMode
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const compact = useMediaQuery('(max-width: 860px)')
  const isLogin = mode === 'login'
  const switchTo = (m: AuthMode) => navigate({ to: `/${m}` })

  return (
    <div style={{ display: 'flex', flexDirection: compact ? 'column' : 'row', minHeight: '100vh', background: COLORS.appBg }}>
      {/* Panel de marca */}
      <aside
        style={{
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          width: compact ? '100%' : '42%',
          background: COLORS.sidebar,
          color: COLORS.onDark,
          padding: compact ? '18px 24px' : '40px 44px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, zIndex: 1 }}>
          <Seal size={compact ? 24 : 28} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: FONTS.sans, fontSize: compact ? 16 : 18, fontWeight: 600 }}>Cerberus</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.onDarkMuted, letterSpacing: '0.08em' }}>
              SECURITY GATE
            </span>
          </span>
        </div>

        {/* Mensaje (solo escritorio) */}
        {!compact && (
          <div style={{ marginTop: 'auto', marginBottom: 'auto', zIndex: 1 }}>
            <h2 style={{ fontFamily: FONTS.sans, fontSize: 30, fontWeight: 600, lineHeight: 1.2, maxWidth: 360 }}>
              El guardián de tus despliegues
            </h2>
            <p style={{ marginTop: 14, fontFamily: FONTS.sans, fontSize: 15, lineHeight: 1.6, color: COLORS.onDarkMuted, maxWidth: 340 }}>
              Análisis de seguridad y calidad de código en cada commit. Un veredicto claro antes de
              que el cambio llegue a producción.
            </p>
          </div>
        )}

        {!compact && (
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.onDarkMuted, zIndex: 1 }}>
            DevSecOps · Kubernetes · GitHub Actions
          </span>
        )}

        {/* Marca de agua */}
        {!compact && (
          <div aria-hidden style={{ position: 'absolute', right: -60, bottom: -60, opacity: 0.05, color: '#fff' }}>
            <Seal size={320} weight={3} />
          </div>
        )}
      </aside>

      {/* Panel de formulario */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: compact ? '36px 24px 48px' : '40px',
        }}
      >
        {/* Switch Entrar / Crear cuenta */}
        <div
          style={{
            display: 'inline-flex',
            padding: 4,
            marginBottom: 28,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.pill,
          }}
        >
          <Tab label="Entrar" active={isLogin} onClick={() => switchTo('login')} />
          <Tab label="Crear cuenta" active={!isLogin} onClick={() => switchTo('register')} />
        </div>

        {isLogin ? (
          <LoginForm onSwitchToRegister={() => switchTo('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => switchTo('login')} />
        )}
      </main>
    </div>
  )
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        appearance: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 18px',
        borderRadius: RADIUS.pill,
        fontFamily: FONTS.sans,
        fontSize: 13.5,
        fontWeight: 600,
        background: active ? COLORS.brand : 'transparent',
        color: active ? '#fff' : COLORS.textMuted,
        transition: 'background 0.18s ease, color 0.18s ease',
      }}
    >
      {label}
    </button>
  )
}
