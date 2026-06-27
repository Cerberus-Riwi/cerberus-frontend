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
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 38px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.4" fill="#22d3ee" />
          <circle cx="6.4" cy="14.5" r="2.8" fill="#3b82f6" />
          <circle cx="17.6" cy="14.5" r="2.8" fill="#ff7a3d" />
        </svg>
        <span style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 600,
          letterSpacing: '0.18em',
          fontSize: 18,
          textTransform: 'uppercase',
          color: '#e9eef8',
        }}>
          Cerberus
        </span>
      </div>

      {/* Tab switcher pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(9,14,25,0.55)',
        border: '1px solid rgba(120,160,220,0.12)',
        borderRadius: 999,
        padding: 6,
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
        position: 'relative',
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '9px 22px',
        borderRadius: 999,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: active ? '#e9eef8' : '#6b7d99',
        transition: 'color 0.5s ease',
      }}
    >
      {label}
      <span style={{
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 3,
        height: 2,
        borderRadius: 2,
        background: 'var(--accent)',
        transform: `scaleX(${active ? 1 : 0})`,
        transformOrigin: 'center',
        transition: 'transform 0.45s cubic-bezier(.76,0,.24,1)',
        display: 'block',
      }} />
    </button>
  )
}
