import type { Verdict } from '../../types/cerberus'
import { VERDICT_META, FONTS, RADIUS } from '../../lib/theme'

interface StatusPillProps {
  verdict: Verdict
  size?: 'sm' | 'md'
}

/** Pastilla de veredicto con punto de color. Legible y semántica. */
export function StatusPill({ verdict, size = 'md' }: StatusPillProps) {
  const meta = VERDICT_META[verdict]
  const sm = size === 'sm'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sm ? 6 : 7,
        padding: sm ? '3px 9px' : '5px 12px',
        borderRadius: RADIUS.pill,
        background: meta.soft,
        color: meta.color,
        fontFamily: FONTS.sans,
        fontSize: sm ? 12 : 13,
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden
        style={{
          width: sm ? 6 : 7,
          height: sm ? 6 : 7,
          borderRadius: '50%',
          background: meta.color,
        }}
      />
      {meta.label}
    </span>
  )
}
