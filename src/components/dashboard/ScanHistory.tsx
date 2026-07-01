import type { Verdict, Severity } from '../../types/cerberus'

export interface ScanHistoryItem {
  scanId: string
  repositoryUrl: string
  branch: string
  verdict: Verdict | null
  status: string
  requestedAt: string
  summary?: { critical: number; high: number; medium: number; low: number; info: number }
}

interface Props {
  items: ScanHistoryItem[]
  onSelect?: (scanId: string) => void
}

const VERDICT_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  pass:    { label: 'PASS',    color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  warning: { label: 'WARNING', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  fail:    { label: 'FAIL',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
}

const SEV_COLORS: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#facc15', low: '#60a5fa', info: '#94a3b8',
}

export function ScanHistory({ items, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#7e90ad', fontSize: 14 }}>
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>⬡</div>
        No hay escaneos aún. Lanza tu primer análisis arriba.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 180px 80px', gap: 16, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#7e90ad', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span>Repositorio / Branch</span>
        <span>Veredicto</span>
        <span>Findings</span>
        <span>Fecha</span>
        <span />
      </div>

      {items.map(item => {
        const badge = item.verdict ? VERDICT_BADGE[item.verdict] : null
        const totalFindings = item.summary
          ? item.summary.critical + item.summary.high + item.summary.medium
          : null

        return (
          <div
            key={item.scanId}
            style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 180px 80px', gap: 16, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
            onClick={() => onSelect?.(item.scanId)}
          >
            <div>
              <div style={{ fontSize: 13, color: '#e9eef8', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.repositoryUrl.replace('https://github.com/', '')}
              </div>
              <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 2 }}>{item.branch}</div>
            </div>

            <div>
              {badge ? (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.1em', color: badge.color, background: badge.bg, border: `1px solid ${badge.color}30` }}>
                  {badge.label}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: '#7e90ad', padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {item.status}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              {item.summary ? (
                <>
                  {item.summary.critical > 0 && <Pill n={item.summary.critical} c={SEV_COLORS.critical} />}
                  {item.summary.high     > 0 && <Pill n={item.summary.high}     c={SEV_COLORS.high}     />}
                  {item.summary.medium   > 0 && <Pill n={item.summary.medium}   c={SEV_COLORS.medium}   />}
                </>
              ) : (
                <span style={{ color: '#7e90ad' }}>—</span>
              )}
            </div>

            <div style={{ fontSize: 12, color: '#7e90ad' }}>
              {new Date(item.requestedAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 12, color: '#60a5fa' }}>Ver →</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Pill({ n, c }: { n: number; c: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: c, background: `${c}18`, padding: '2px 7px', borderRadius: 4 }}>
      {n}
    </span>
  )
}
