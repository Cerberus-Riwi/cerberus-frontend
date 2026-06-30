import type { SeveritySummary } from '../../types/cerberus'
import { SEVERITY_META, SEVERITY_ORDER, FONTS, COLORS } from '../../lib/theme'
import { totalFindings } from '../../lib/verdict'
import { SeverityChip } from './SeverityChip'

interface SeverityMeterProps {
  summary: SeveritySummary
}

/** Espectro proporcional de severidades + conteo por nivel. */
export function SeverityMeter({ summary }: SeverityMeterProps) {
  const total = totalFindings(summary)
  const segments = SEVERITY_ORDER.filter((sev) => summary[sev] > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Barra espectro */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 10,
          borderRadius: 999,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${COLORS.hairlineSoft}`,
        }}
      >
        {total === 0 ? (
          <div
            style={{
              flex: 1,
              background:
                'repeating-linear-gradient(90deg, rgba(34,211,238,0.18) 0 10px, transparent 10px 20px)',
            }}
          />
        ) : (
          segments.map((sev) => (
            <div
              key={sev}
              title={`${SEVERITY_META[sev].label}: ${summary[sev]}`}
              style={{
                flexGrow: summary[sev],
                flexBasis: 0,
                background: SEVERITY_META[sev].color,
                boxShadow: `inset 0 0 8px ${SEVERITY_META[sev].color}`,
              }}
            />
          ))
        )}
      </div>

      {/* Conteo por nivel */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {SEVERITY_ORDER.map((sev) => (
          <SeverityChip key={sev} severity={sev} count={summary[sev]} />
        ))}
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: '0.08em',
            color: COLORS.muted,
            textTransform: 'uppercase',
          }}
        >
          {total} {total === 1 ? 'hallazgo' : 'hallazgos'}
        </span>
      </div>
    </div>
  )
}
