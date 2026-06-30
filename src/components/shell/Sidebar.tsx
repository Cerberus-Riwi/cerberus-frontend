import { Link, useRouterState } from '@tanstack/react-router'
import { COLORS, FONTS, RADIUS } from '../../lib/theme'
import { Seal } from '../ui/Seal'

interface SidebarProps {
  compact: boolean
}

const NAV = [{ to: '/scans', label: 'Escaneos', icon: '▤' }]

export function Sidebar({ compact }: SidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const brand = (
    <Link
      to="/scans"
      style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: COLORS.onDark }}
    >
      <span style={{ color: COLORS.onDark, display: 'flex' }}>
        <Seal size={26} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontFamily: FONTS.sans, fontSize: 16, fontWeight: 600, letterSpacing: '0.01em' }}>
          Cerberus
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.onDarkMuted, letterSpacing: '0.08em' }}>
          SECURITY GATE
        </span>
      </span>
    </Link>
  )

  const nav = NAV.map((item) => {
    const active = pathname.startsWith(item.to)
    return (
      <Link
        key={item.to}
        to={item.to}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '9px 12px',
          borderRadius: RADIUS.sm,
          textDecoration: 'none',
          fontFamily: FONTS.sans,
          fontSize: 14,
          fontWeight: active ? 600 : 500,
          color: active ? '#fff' : COLORS.onDarkMuted,
          background: active ? COLORS.sidebarRaised : 'transparent',
          transition: 'background 0.15s ease, color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.color = COLORS.onDark
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.color = COLORS.onDarkMuted
        }}
      >
        <span aria-hidden style={{ width: 16, textAlign: 'center', opacity: 0.9 }}>{item.icon}</span>
        {item.label}
      </Link>
    )
  })

  const account = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: COLORS.brand,
          color: '#fff',
          fontFamily: FONTS.sans,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        JC
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500, color: COLORS.onDark }}>
          Jaramc
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: COLORS.onDarkMuted }}>
          Líder técnico
        </span>
      </div>
      <Link
        to="/login"
        title="Salir"
        style={{ color: COLORS.onDarkMuted, textDecoration: 'none', fontSize: 16, padding: 4 }}
      >
        ⏻
      </Link>
    </div>
  )

  // ── Barra superior en móvil ──
  if (compact) {
    return (
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '12px 18px',
          background: COLORS.sidebar,
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        {brand}
        <nav style={{ display: 'flex', gap: 6 }}>{nav}</nav>
      </header>
    )
  }

  // ── Sidebar vertical en escritorio ──
  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 248,
        flexShrink: 0,
        background: COLORS.sidebar,
        position: 'sticky',
        top: 0,
        height: '100vh',
        padding: '22px 16px',
      }}
    >
      <div style={{ padding: '0 4px 22px' }}>{brand}</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{nav}</nav>
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {account}
      </div>
    </aside>
  )
}
