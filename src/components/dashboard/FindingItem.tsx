import { useState } from 'react'
import type { Finding } from '../../types/cerberus'
import { SEVERITY_META, COLORS, FONTS, RADIUS } from '../../lib/theme'

interface FindingItemProps {
  finding: Finding
  /** ¿es la última fila? (controla el borde inferior) */
  last: boolean
}

function lineLabel(f: Finding): string | null {
  if (f.lineStart === undefined) return null
  if (f.lineEnd && f.lineEnd !== f.lineStart) return `${f.lineStart}–${f.lineEnd}`
  return String(f.lineStart)
}

export function FindingItem({ finding, last }: FindingItemProps) {
  const [open, setOpen] = useState(false)
  const meta = SEVERITY_META[finding.severity]
  const hasDetail = Boolean(finding.description || finding.recommendation)
  const line = lineLabel(finding)

  return (
    <div style={{ borderBottom: last ? 'none' : `1px solid ${COLORS.border}` }}>
      <button
        type="button"
        onClick={() => hasDetail && setOpen((v) => !v)}
        aria-expanded={hasDetail ? open : undefined}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 18px',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: hasDetail ? 'pointer' : 'default',
          color: 'inherit',
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: 70,
            fontFamily: FONTS.mono,
            fontSize: 11,
            fontWeight: 600,
            color: meta.color,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: 2, background: meta.color }} />
          {meta.label}
        </span>

        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontFamily: FONTS.sans, fontSize: 14.5, color: COLORS.ink }}>{finding.title}</span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11.5,
              color: COLORS.textFaint,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {finding.filePath}
            {line && <span style={{ color: COLORS.textMuted }}>:{line}</span>}
            <span> · {finding.ruleId}</span>
          </span>
        </span>

        {hasDetail && (
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              color: COLORS.textFaint,
              fontSize: 11,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            ▾
          </span>
        )}
      </button>

      {hasDetail && open && (
        <div style={{ padding: '0 18px 16px 84px', display: 'flex', flexDirection: 'column', gap: 12, animation: 'cb-rise 0.2s ease' }}>
          {finding.description && (
            <p style={{ margin: 0, fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 1.6, color: COLORS.textMuted }}>
              {finding.description}
            </p>
          )}
          {finding.recommendation && (
            <div style={{ padding: '11px 14px', borderRadius: RADIUS.sm, background: COLORS.brandSoft }}>
              <span style={{ display: 'block', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.brand, marginBottom: 5 }}>
                Recomendación
              </span>
              <p style={{ margin: 0, fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 1.6, color: COLORS.text }}>
                {finding.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
