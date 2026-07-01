import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../lib/useAuth'
import { ScanLauncher } from './ScanLauncher'
import { ScanHistory } from './ScanHistory'
import type { ScanHistoryItem } from './ScanHistory'

const MOCK_HISTORY: ScanHistoryItem[] = [
  {
    scanId: 'a1b2c3d4-0000-0000-0000-000000000001',
    repositoryUrl: 'https://github.com/acme/backend-api',
    branch: 'main',
    verdict: 'fail',
    status: 'completed',
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    summary: { critical: 2, high: 5, medium: 3, low: 1, info: 0 },
  },
  {
    scanId: 'a1b2c3d4-0000-0000-0000-000000000002',
    repositoryUrl: 'https://github.com/acme/frontend-app',
    branch: 'develop',
    verdict: 'warning',
    status: 'completed',
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    summary: { critical: 0, high: 1, medium: 4, low: 2, info: 1 },
  },
  {
    scanId: 'a1b2c3d4-0000-0000-0000-000000000003',
    repositoryUrl: 'https://github.com/acme/infra-k8s',
    branch: 'main',
    verdict: 'pass',
    status: 'completed',
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    summary: { critical: 0, high: 0, medium: 0, low: 1, info: 3 },
  },
]

export function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate({ to: '/login' }) }

  return (
    <div style={{ minHeight: '100vh', background: '#04060b', color: '#e9eef8', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>

      {/* Grid decorativo de fondo */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
      }} />

      {/* Glow ambiental superior */}
      <div aria-hidden style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 300, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 100%)',
      }} />

      {/* ── Topbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
        background: 'rgba(4,6,11,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: '#e9eef8', textTransform: 'uppercase' }}>
            CERBERUS
          </span>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 13, color: '#7e90ad' }}>Dashboard</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {user?.role === 'admin' && (
            <a href="/admin" style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Admin →
            </a>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#60a5fa', fontWeight: 700 }}>
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#e9eef8' }}>{user?.email ?? 'Usuario'}</div>
              <div style={{ fontSize: 11, color: '#7e90ad', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ fontSize: 12, color: '#7e90ad', background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Salir
          </button>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Saludo */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#60a5fa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
            // bienvenido de vuelta
          </div>
          <h1 style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 36, textTransform: 'uppercase', color: '#e9eef8' }}>
            Panel de seguridad
          </h1>
          <p style={{ margin: '8px 0 0', color: '#7e90ad', fontSize: 14 }}>
            Analiza repositorios y consulta los resultados de los escaneos de seguridad.
          </p>
        </div>

        {/* Lanzador de escaneo */}
        <ScanLauncher onScanComplete={scanId => navigate({ to: `/dashboard/${scanId}` })} />

        {/* Historial */}
        <div style={{ background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 3, height: 22, background: '#3b82f6', borderRadius: 2 }} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: '#60a5fa', textTransform: 'uppercase', marginBottom: 2 }}>
                // historial
              </div>
              <h2 style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, textTransform: 'uppercase', color: '#e9eef8' }}>
                Mis escaneos
              </h2>
            </div>
          </div>
          <ScanHistory items={MOCK_HISTORY} onSelect={id => navigate({ to: `/dashboard/${id}` })} />
        </div>

      </main>
    </div>
  )
}
