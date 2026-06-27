import { Link } from '@tanstack/react-router'
import type { AuthMode } from '../../types/cerberus'

interface AuthNavbarProps {
  mode: AuthMode
  onSwitch: (mode: AuthMode) => void
}

export function AuthNavbar({ mode, onSwitch }: AuthNavbarProps) {
  const isLogin = mode === 'login'

  return (
    <nav style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 80,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 38px',
    }}>
      {/* Solo el nombre — link a la landing page */}
      <Link
        to="/"
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 600,
          letterSpacing: '0.18em',
          fontSize: 18,
          textTransform: 'uppercase',
          color: '#e9eef8',
          textDecoration: 'none',
        }}
      >
        Cerberus
      </Link>

      {/* Pill container — tab switcher estilo macOS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(9,14,25,0.55)',
        border: '1px solid rgba(120,160,220,0.12)',
        borderRadius: 999,
        padding: 4,
        gap: 2,
      }}>
        <TabButton label="Login"    active={isLogin}  onClick={() => onSwitch('login')} />
        <TabButton label="Register" active={!isLogin} onClick={() => onSwitch('register')} />
      </div>
    </nav>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 20px',
        borderRadius: 999,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        // El tab activo tiene un recuadro translúcido estilo macOS
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: active ? '#e9eef8' : '#6b7d99',
        boxShadow: active
          ? 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 1px 4px rgba(0,0,0,0.3)'
          : 'none',
        backdropFilter: active ? 'blur(6px)' : 'none',
        transition: 'background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {label}
    </button>
  )
}
