import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../lib/useAuth'
import { ScanLauncher } from '../dashboard/ScanLauncher'
import { ScanHistory } from '../dashboard/ScanHistory'
import type { ScanHistoryItem } from '../dashboard/ScanHistory'

const MOCK_MY_SCANS: ScanHistoryItem[] = [
  {
    scanId: 'admin-scan-001',
    repositoryUrl: 'https://github.com/cerberus-riwi/cerberus-frontend',
    branch: 'main',
    verdict: 'pass',
    status: 'completed',
    requestedAt: new Date(Date.now() - 7200000).toISOString(),
    summary: { critical: 0, high: 0, medium: 1, low: 2, info: 4 },
  },
  {
    scanId: 'admin-scan-002',
    repositoryUrl: 'https://github.com/cerberus-riwi/cerberus-securitygate',
    branch: 'develop',
    verdict: 'warning',
    status: 'completed',
    requestedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    summary: { critical: 0, high: 2, medium: 3, low: 1, info: 0 },
  },
]

const SOON_TABS = [
  { label: 'KPIs Globales',    reason: 'Disponible cuando haya usuarios activos en el sistema.' },
  { label: 'Todos los scans',  reason: 'Vista global multi-usuario — próximamente.' },
  { label: 'Usuarios',         reason: 'Gestión de cuentas — próximamente.' },
]

export function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate({ to: '/login' }) }

  return (
    <div style={{ minHeight: '100vh', background: '#04060b', color: '#e9eef8', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>

      {/* Grid decorativo */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
      }} />

      <div aria-hidden style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 280, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 100%)',
      }} />

      {/* ── Topbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
        background: 'rgba(4,6,11,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: '#e9eef8', textTransform: 'uppercase' }}>
            CERBERUS
          </span>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 12, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Admin</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#a78bfa', fontWeight: 700 }}>
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#e9eef8' }}>{user?.email}</div>
              <div style={{ fontSize: 11, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Administrador</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ fontSize: 12, color: '#7e90ad', background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Salir
          </button>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div style={{ position: 'sticky', top: 64, zIndex: 40, background: 'rgba(4,6,11,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 1200, margin: '0 auto' }}>
          {/* Tab activo */}
          <div style={{
            padding: '14px 22px',
            fontSize: 13,
            color: '#e9eef8',
            borderBottom: '2px solid #a78bfa',
            letterSpacing: '0.04em',
            userSelect: 'none',
          }}>
            Mis escaneos
          </div>

          {/* Tabs SOON */}
          {SOON_TABS.map(t => (
            <div
              key={t.label}
              title={t.reason}
              style={{
                padding: '14px 22px',
                fontSize: 13,
                color: '#3d5580',
                borderBottom: '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'not-allowed',
                userSelect: 'none',
              }}
            >
              {t.label}
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#3d5580', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 6px' }}>
                SOON
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contenido ── */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
            // panel personal
          </div>
          <h1 style={{ margin: '0 0 8px', fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, textTransform: 'uppercase', color: '#e9eef8' }}>
            Mis escaneos
          </h1>
          <p style={{ margin: 0, color: '#7e90ad', fontSize: 14 }}>
            Analiza repositorios y consulta los resultados de tus escaneos de seguridad.
          </p>
        </div>

        <ScanLauncher />

        <div style={{ background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, height: 20, background: '#a78bfa', borderRadius: 2 }} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>
                // historial
              </div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, textTransform: 'uppercase', color: '#e9eef8' }}>
                Historial de escaneos
              </div>
            </div>
          </div>
          <ScanHistory items={MOCK_MY_SCANS} />
        </div>

      </main>
    </div>
  )
}
