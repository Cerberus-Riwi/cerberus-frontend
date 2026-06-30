import { useEffect, useMemo, useState } from 'react'
import type { ScanVerdict } from '../types/cerberus'
import { getScanVerdicts, getScanRequest } from '../lib/scans'
import { FONTS, COLORS, VERDICT_META } from '../lib/theme'
import { ScanCard } from '../components/dashboard/ScanCard'

export function ScansListPage() {
  const [verdicts, setVerdicts] = useState<ScanVerdict[] | null>(null)
  const now = useMemo(() => new Date(), [])

  useEffect(() => {
    let active = true
    getScanVerdicts().then((data) => {
      if (active) setVerdicts(data)
    })
    return () => {
      active = false
    }
  }, [])

  const counts = useMemo(() => {
    const base = { pass: 0, warning: 0, fail: 0 }
    for (const v of verdicts ?? []) base[v.verdict] += 1
    return base
  }, [verdicts])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(120% 70% at 50% -10%, #0a1424 0%, #04060b 55%, #060406 100%)',
        color: COLORS.text,
        fontFamily: FONTS.body,
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Encabezado */}
        <header style={{ marginBottom: 8 }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: COLORS.muted,
            }}
          >
            Cerberus · Security Gate
          </span>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontSize: 'clamp(34px, 6vw, 52px)',
              fontWeight: 600,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              margin: '6px 0 0',
            }}
          >
            Veredictos de escaneo
          </h1>
        </header>

        {/* Resumen por estado */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '22px 0 30px' }}>
          {(['pass', 'warning', 'fail'] as const).map((v) => (
            <div
              key={v}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 9,
                padding: '9px 15px',
                borderRadius: 12,
                background: COLORS.panel,
                border: `1px solid ${VERDICT_META[v].accent}40`,
              }}
            >
              <strong
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 22,
                  fontWeight: 600,
                  color: VERDICT_META[v].accent,
                }}
              >
                {counts[v]}
              </strong>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: COLORS.muted,
                }}
              >
                {VERDICT_META[v].label}
              </span>
            </div>
          ))}
        </div>

        {/* Lista */}
        {verdicts === null ? (
          <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.muted }}>
            Cargando veredictos…
          </p>
        ) : verdicts.length === 0 ? (
          <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.muted }}>
            Aún no hay escaneos. Cuando el CI dispare un análisis, aparecerá aquí.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {verdicts.map((v) => (
              <ScanCard key={v.scanId} verdict={v} request={getScanRequest(v.scanId)} now={now} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
