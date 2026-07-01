import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../lib/useAuth'
import { KpiDashboard } from './KpiDashboard'
import { ScanLauncher } from '../dashboard/ScanLauncher'
import { ScanHistory } from '../dashboard/ScanHistory'
import type { ScanHistoryItem } from '../dashboard/ScanHistory'

type Tab = 'kpis' | 'mis-scans' | 'todos' | 'usuarios'

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

const MOCK_ALL_SCANS: ScanHistoryItem[] = [
  ...MOCK_MY_SCANS,
  {
    scanId: 'user-scan-001',
    repositoryUrl: 'https://github.com/acme/backend-api',
    branch: 'main',
    verdict: 'fail',
    status: 'completed',
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    summary: { critical: 3, high: 5, medium: 2, low: 0, info: 0 },
  },
  {
    scanId: 'user-scan-002',
    repositoryUrl: 'https://github.com/acme/frontend-app',
    branch: 'develop',
    verdict: 'pass',
    status: 'completed',
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    summary: { critical: 0, high: 0, medium: 0, low: 1, info: 2 },
  },
]

export function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('kpis')

  const handleLogout = () => { logout(); navigate({ to: '/login' }) }

  return (
    <div style={{ minHeight: '100vh', background: '#04060b', color: '#e9eef8', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>

      {/* Grid decorativo */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
      }} />

      {/* Glow ambiental */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="/dashboard" style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ← Mi portal
          </a>
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
          {([
            { id: 'kpis',      label: 'KPIs Globales' },
            { id: 'mis-scans', label: 'Mis escaneos'  },
            { id: 'todos',     label: 'Todos los scans' },
            { id: 'usuarios',  label: 'Usuarios'       },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '14px 22px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontFamily: "'Space Grotesk', sans-serif",
                color: tab === t.id ? '#e9eef8' : '#7e90ad',
                borderBottom: `2px solid ${tab === t.id ? '#a78bfa' : 'transparent'}`,
                transition: 'color 0.2s, border-color 0.2s',
                letterSpacing: '0.04em',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenido ── */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '36px 32px' }}>

        {tab === 'kpis' && (
          <div>
            <SectionHeader
              mono="// métricas globales"
              title="KPIs del sistema"
              sub="Datos en tiempo real de todos los repositorios y usuarios."
            />
            <KpiDashboard />
          </div>
        )}

        {tab === 'mis-scans' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <SectionHeader
              mono="// panel privado admin"
              title="Mis escaneos"
              sub="Escaneos lanzados desde tu cuenta de administrador."
            />
            <ScanLauncher onScanComplete={id => navigate({ to: `/dashboard/${id}` })} />
            <div style={{ background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 3, height: 20, background: '#a78bfa', borderRadius: 2 }} />
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>// historial</div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, textTransform: 'uppercase', color: '#e9eef8' }}>Historial propio</div>
                </div>
              </div>
              <ScanHistory items={MOCK_MY_SCANS} onSelect={id => navigate({ to: `/dashboard/${id}` })} />
            </div>
          </div>
        )}

        {tab === 'todos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <SectionHeader
              mono="// vista global"
              title="Todos los escaneos"
              sub="Historial completo del sistema — todos los usuarios."
            />
            <div style={{ background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
              <ScanHistory items={MOCK_ALL_SCANS} onSelect={id => navigate({ to: `/dashboard/${id}` })} />
            </div>
          </div>
        )}

        {tab === 'usuarios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <SectionHeader
              mono="// gestión"
              title="Usuarios"
              sub="Administración de cuentas del sistema."
            />
            <UsersPlaceholder />
          </div>
        )}
      </main>
    </div>
  )
}

function SectionHeader({ mono, title, sub }: { mono: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
        {mono}
      </div>
      <h1 style={{ margin: '0 0 8px', fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, textTransform: 'uppercase', color: '#e9eef8' }}>
        {title}
      </h1>
      <p style={{ margin: 0, color: '#7e90ad', fontSize: 14 }}>{sub}</p>
    </div>
  )
}

function UsersPlaceholder() {
  return (
    <div style={{ background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '48px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.4 }}>⬡</div>
      <div style={{ fontSize: 14, color: '#7e90ad', marginBottom: 8 }}>Gestión de usuarios</div>
      <div style={{ fontSize: 12, color: '#3d5580' }}>
        Requiere endpoint <code style={{ color: '#60a5fa' }}>GET /api/admin/users</code> en cerberus-securitygate.
        <br />Se implementa en el siguiente sprint.
      </div>
    </div>
  )
}
