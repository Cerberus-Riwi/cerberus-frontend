import type { Severity } from '../../types/cerberus'
import { SEVERITY_META, FONTS, RADIUS } from '../../lib/theme'

interface SeverityBadgeProps {
  severity: Severity
  count?: number
  /** atenúa cuando el conteo es cero */
  muted?: boolean
}

/** Etiqueta de severidad con color semántico, opcionalmente con conteo. */
export function SeverityBadge({ severity, count, muted = false }: SeverityBadgeProps) {
  const meta = SEVERITY_META[severity]
  const off = muted || count === 0

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: RADIUS.sm,
        background: off ? '#F1F3F5' : meta.soft,
        color: off ? '#9AA3AF' : meta.color,
        fontFamily: FONTS.mono,
        fontSize: 11.5,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden
        style={{ width: 6, height: 6, borderRadius: 2, background: off ? '#C4CAD2' : meta.color }}
      />
      {meta.label}
      {count !== undefined && <strong style={{ fontWeight: 700 }}>{count}</strong>}
    </span>
  )
}
