import { useEffect, useMemo, useState } from 'react'
import type { ScanVerdict, Verdict } from '../types/cerberus'
import { getScanVerdicts, getScanRequest } from '../lib/scans'
import { COLORS, FONTS, RADIUS } from '../lib/theme'
import { ScanList, type ScanRow } from '../components/dashboard/ScanList'
import { StatCards, type VerdictFilter } from '../components/dashboard/StatCards'

export function ScansListPage() {
  const [verdicts, setVerdicts] = useState<ScanVerdict[] | null>(null)
  const [filter, setFilter] = useState<VerdictFilter>('all')
  const [query, setQuery] = useState('')
  const now = useMemo(() => new Date(), [])

  useEffect(() => {
    let active = true
    getScanVerdicts().then((data) => active && setVerdicts(data))
    return () => {
      active = false
    }
  }, [])

  const rows: ScanRow[] = useMemo(
    () => (verdicts ?? []).map((v) => ({ verdict: v, request: getScanRequest(v.scanId) })),
    [verdicts],
  )

  const counts = useMemo(() => {
    const base: Record<Verdict, number> = { pass: 0, warning: 0, fail: 0 }
    for (const r of rows) base[r.verdict.verdict] += 1
    return base
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (filter !== 'all' && r.verdict.verdict !== filter) return false
      if (!q) return true
      const hay = `${r.request?.repositoryUrl ?? ''} ${r.request?.branch ?? ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [rows, filter, query])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          padding: '18px 28px',
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <h1 style={{ fontFamily: FONTS.sans, fontSize: 20, fontWeight: 600, color: COLORS.ink }}>
            Escaneos
          </h1>
          <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
            Veredictos del Security Gate por repositorio
          </p>
        </div>
        <SearchBox value={query} onChange={setQuery} />
      </header>

      {/* Contenido */}
      <div style={{ padding: '24px 28px 56px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <StatCards counts={counts} active={filter} onSelect={setFilter} />

        {verdicts === null ? (
          <SkeletonList />
        ) : filtered.length === 0 ? (
          <EmptyState hasScans={rows.length > 0} />
        ) : (
          <div style={{ animation: 'cb-rise 0.3s ease' }}>
            <ScanList rows={filtered} now={now} />
          </div>
        )}
      </div>
    </div>
  )
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative', width: 'min(320px, 60vw)' }}>
      <span
        aria-hidden
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.textFaint, fontSize: 14 }}
      >
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar repositorio o rama…"
        aria-label="Buscar"
        style={{
          width: '100%',
          padding: '9px 12px 9px 32px',
          background: COLORS.surfaceSubtle,
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.sm,
          fontFamily: FONTS.sans,
          fontSize: 13.5,
          color: COLORS.text,
          outline: 'none',
        }}
      />
    </div>
  )
}

function SkeletonList() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, #ECEEF1 25%, #F4F5F7 50%, #ECEEF1 75%)',
    backgroundSize: '480px 100%',
    animation: 'cb-shimmer 1.3s infinite linear',
    borderRadius: 6,
  }
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, overflow: 'hidden' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderTop: i === 0 ? 'none' : `1px solid ${COLORS.border}` }}>
          <div style={{ ...shimmer, width: 90, height: 22, borderRadius: 999 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ ...shimmer, width: '40%', height: 12 }} />
            <div style={{ ...shimmer, width: '25%', height: 10 }} />
          </div>
          <div style={{ ...shimmer, width: 60, height: 12 }} />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ hasScans }: { hasScans: boolean }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        color: COLORS.textMuted,
        fontFamily: FONTS.sans,
        fontSize: 14,
      }}
    >
      {hasScans
        ? 'Ningún escaneo coincide con el filtro. Ajusta la búsqueda o el estado.'
        : 'Aún no hay escaneos. Cuando el CI dispare un análisis, aparecerá aquí.'}
    </div>
  )
}
