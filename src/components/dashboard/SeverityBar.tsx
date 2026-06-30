import type { SeveritySummary } from '../../types/cerberus'
import { SEVERITY_META, SEVERITY_ORDER, COLORS } from '../../lib/theme'
import { totalFindings } from '../../lib/verdict'

interface SeverityBarProps {
  summary: SeveritySummary
  height?: number
}

/** Barra proporcional de severidades. Reutilizable en lista y detalle. */
export function SeverityBar({ summary, height = 6 }: SeverityBarProps) {
  const total = totalFindings(summary)
  const present = SEVERITY_ORDER.filter((s) => summary[s] > 0)

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height,
        borderRadius: 999,
        overflow: 'hidden',
        background: total === 0 ? COLORS.border : 'transparent',
        gap: total === 0 ? 0 : 2,
      }}
    >
      {present.map((sev) => (
        <div
          key={sev}
          title={`${SEVERITY_META[sev].label}: ${summary[sev]}`}
          style={{ flexGrow: summary[sev], flexBasis: 0, background: SEVERITY_META[sev].color, borderRadius: 999 }}
        />
      ))}
    </div>
  )
}
