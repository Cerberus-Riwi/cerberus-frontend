import { useEffect, useState } from 'react'
import { kpi, type KpiDashboard as KpiData } from '../../lib/api'

const SEV_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#facc15',
  low:      '#60a5fa',
  info:     '#94a3b8',
}

const VERDICT_COLORS: Record<string, string> = {
  pass:    '#22d3ee',
  warning: '#f59e0b',
  fail:    '#ef4444',
}

export function KpiDashboard() {
  const [data, setData]       = useState<KpiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    kpi.dashboard()
      .then(setData)
      .catch(() => setError('No se pudo cargar los KPIs. Verifica que cerberus-ml esté activo.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState msg={error} />
  if (!data)   return null

  const totalScans   = data.verdicts.reduce((s, v) => s + v.total, 0)
  const totalFindings = data.severity.reduce((s, v) => s + v.total, 0)
  const passRate = totalScans > 0
    ? Math.round(((data.verdicts.find(v => v.verdict === 'pass')?.total ?? 0) / totalScans) * 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* KPI cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <KpiCard label="Escaneos totales" value={totalScans} color="#3b82f6" />
        <KpiCard label="Pass rate" value={`${passRate}%`} color="#22d3ee" />
        <KpiCard label="Findings totales" value={totalFindings} color="#f97316" />
        <KpiCard label="Repositorios activos" value={data.repositories.length} color="#a78bfa" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Veredictos */}
        <Panel title="Veredictos" mono="// verdicts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.verdicts.map(v => (
              <BarRow
                key={v.verdict}
                label={v.verdict.toUpperCase()}
                value={v.total}
                max={totalScans}
                color={VERDICT_COLORS[v.verdict] ?? '#94a3b8'}
              />
            ))}
          </div>
        </Panel>

        {/* Severidad */}
        <Panel title="Findings por severidad" mono="// severity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.severity.map(s => (
              <BarRow
                key={s.severity}
                label={s.severity.toUpperCase()}
                value={s.total}
                max={totalFindings}
                color={SEV_COLORS[s.severity] ?? '#94a3b8'}
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* Top reglas */}
      <Panel title="Reglas más violadas" mono="// top-rules">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto auto', gap: 12, padding: '8px 16px', fontSize: 11, color: '#7e90ad', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span>#</span><span>Regla</span><span>ID</span><span>Findings</span>
          </div>
          {data.top_rules.slice(0, 8).map((r, i) => (
            <div key={r.rule_id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto auto', gap: 12, padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 13, transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}>
              <span style={{ color: '#7e90ad', fontFamily: "'JetBrains Mono', monospace" }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ color: '#e9eef8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
              <span style={{ color: '#60a5fa', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{r.rule_id}</span>
              <span style={{ color: '#f97316', fontWeight: 700, textAlign: 'right' }}>{r.total_findings}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Historial por día */}
      <Panel title="Tendencia de findings" mono="// history">
        <HistoryChart data={data.history.slice(-14)} />
      </Panel>

      {/* Repositorios */}
      <Panel title="Repositorios" mono="// repositories">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {data.repositories.slice(0, 6).map(r => (
            <div key={r.repository_url} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto auto', gap: 12, padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 13, alignItems: 'center' }}>
              <div>
                <div style={{ color: '#e9eef8', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{r.repository_name}</div>
                <div style={{ color: '#7e90ad', fontSize: 11 }}>{r.organization}</div>
              </div>
              <SevPill n={r.critical} c={SEV_COLORS.critical} label="C" />
              <SevPill n={r.high}     c={SEV_COLORS.high}     label="H" />
              <SevPill n={r.medium}   c={SEV_COLORS.medium}   label="M" />
              <SevPill n={r.low}      c={SEV_COLORS.low}      label="L" />
              <span style={{ color: '#94a3b8', fontSize: 12, textAlign: 'right' }}>{r.total_findings} total</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function KpiCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ background: 'rgba(12,18,32,0.8)', border: `1px solid ${color}22`, borderRadius: 14, padding: '22px 24px' }}>
      <div style={{ fontSize: 11, color: '#7e90ad', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 38, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function Panel({ title, mono, children }: { title: string; mono: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 3, height: 18, background: '#3b82f6', borderRadius: 2 }} />
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#60a5fa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 1 }}>{mono}</div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, textTransform: 'uppercase', color: '#e9eef8' }}>{title}</div>
        </div>
      </div>
      <div style={{ padding: '16px 8px' }}>{children}</div>
    </div>
  )
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 48px', gap: 12, alignItems: 'center', padding: '0 8px' }}>
      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.06em' }}>{label}</span>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 12, color: '#9fb0cc', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
  )
}

function SevPill({ n, c, label }: { n: number; c: string; label: string }) {
  if (n === 0) return <span style={{ color: '#3d5580', fontSize: 11 }}>—</span>
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: c, background: `${c}18`, padding: '2px 7px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace" }}>
      {label}{n}
    </span>
  )
}

function HistoryChart({ data }: { data: Array<{ full_date: string; total_findings: number }> }) {
  if (data.length === 0) return <div style={{ padding: '24px 16px', color: '#7e90ad', fontSize: 13, textAlign: 'center' }}>Sin datos de historial.</div>

  const max = Math.max(...data.map(d => d.total_findings), 1)

  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90 }}>
        {data.map(d => {
          const h = Math.max(4, (d.total_findings / max) * 80)
          return (
            <div key={d.full_date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'default' }}
              title={`${d.full_date}: ${d.total_findings} findings`}>
              <div style={{ width: '100%', height: h, background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '3px 3px 0 0', transition: 'opacity 0.2s', opacity: 0.8 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')} />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#7e90ad', fontFamily: "'JetBrains Mono', monospace" }}>
        <span>{data[0]?.full_date?.slice(5)}</span>
        <span>{data[data.length - 1]?.full_date?.slice(5)}</span>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: '#7e90ad', fontSize: 13 }}>
      Cargando métricas globales...
    </div>
  )
}

function ErrorState({ msg }: { msg: string }) {
  return (
    <div style={{ padding: '32px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#ef4444', fontSize: 13 }}>
      {msg}
    </div>
  )
}
