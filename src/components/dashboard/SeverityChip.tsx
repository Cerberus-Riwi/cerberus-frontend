import type { Severity } from '../../types/cerberus'
import { SEVERITY_META, FONTS } from '../../lib/theme'

interface SeverityChipProps {
  severity: Severity
  /** muestra un número a la derecha del nombre */
  count?: number
  /** variante compacta: solo punto + número */
  dense?: boolean
}

/** Pastilla de severidad reutilizable (resumen, lista y findings). */
export function SeverityChip({ severity, count, dense = false }: SeverityChipProps) {
  const meta = SEVERITY_META[severity]
  const muted = count === 0

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: dense ? '3px 9px' : '5px 11px',
        borderRadius: 999,
        background: muted ? 'rgba(255,255,255,0.02)' : `${meta.color}1a`,
        border: `1px solid ${muted ? 'rgba(255,255,255,0.07)' : `${meta.color}55`}`,
        fontFamily: FONTS.mono,
        fontSize: 11,
        letterSpacing: '0.04em',
        color: muted ? '#56627a' : meta.color,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 2,
          background: muted ? '#56627a' : meta.color,
          boxShadow: muted ? 'none' : `0 0 8px ${meta.color}`,
        }}
      />
      {!dense && <span style={{ textTransform: 'uppercase' }}>{meta.label}</span>}
      {count !== undefined && <strong style={{ fontWeight: 700 }}>{count}</strong>}
    </span>
  )
}
