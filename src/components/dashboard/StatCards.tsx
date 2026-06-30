import type { Verdict } from '../../types/cerberus'
import { VERDICT_META, COLORS, FONTS, RADIUS } from '../../lib/theme'

export type VerdictFilter = Verdict | 'all'

interface StatCardsProps {
  counts: Record<Verdict, number>
  active: VerdictFilter
  onSelect: (f: VerdictFilter) => void
}

const ORDER: Verdict[] = ['pass', 'warning', 'fail']

/** Tarjetas de conteo por veredicto que además filtran la lista. */
export function StatCards({ counts, active, onSelect }: StatCardsProps) {
  const total = counts.pass + counts.warning + counts.fail

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
      <Card
        label="Todos"
        value={total}
        color={COLORS.brand}
        isActive={active === 'all'}
        onClick={() => onSelect('all')}
      />
      {ORDER.map((v) => (
        <Card
          key={v}
          label={VERDICT_META[v].label}
          value={counts[v]}
          color={VERDICT_META[v].color}
          isActive={active === v}
          onClick={() => onSelect(active === v ? 'all' : v)}
        />
      ))}
    </div>
  )
}

function Card({
  label,
  value,
  color,
  isActive,
  onClick,
}: {
  label: string
  value: number
  color: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px 18px',
        textAlign: 'left',
        cursor: 'pointer',
        background: COLORS.surface,
        border: `1px solid ${isActive ? color : COLORS.border}`,
        boxShadow: isActive ? `inset 0 0 0 1px ${color}` : 'none',
        borderRadius: RADIUS.md,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        <span style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500, color: COLORS.textMuted }}>
          {label}
        </span>
      </span>
      <span style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 600, color: COLORS.ink, lineHeight: 1 }}>
        {value}
      </span>
    </button>
  )
}
