import { Outlet } from '@tanstack/react-router'
import { COLORS } from '../../lib/theme'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { Sidebar } from './Sidebar'

/** Estructura del panel: sidebar + área de contenido. Responsive. */
export function AppShell() {
  const compact = useMediaQuery('(max-width: 820px)')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: compact ? 'column' : 'row',
        minHeight: '100vh',
        background: COLORS.appBg,
      }}
    >
      <Sidebar compact={compact} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}
