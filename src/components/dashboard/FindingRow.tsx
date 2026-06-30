import { useState } from 'react'
import type { Finding } from '../../types/cerberus'
import { SEVERITY_META, FONTS, COLORS } from '../../lib/theme'

interface FindingRowProps {
  finding: Finding
}

function lineLabel(finding: Finding): string | null {
  if (finding.lineStart === undefined) return null
  if (finding.lineEnd && finding.lineEnd !== finding.lineStart) {
    return `${finding.lineStart}–${finding.lineEnd}`
  }
  return String(finding.lineStart)
}

/** Hallazgo individual, expandible para ver descripción y recomendación. */
export function FindingRow({ finding }: FindingRowProps) {
  const [open, setOpen] = useState(false)
  const meta = SEVERITY_META[finding.severity]
  const hasDetail = Boolean(finding.description || finding.recommendation)
  const line = lineLabel(finding)

  return (
    <div
      style={{
        borderRadius: 12,
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairlineSoft}`,
        borderLeft: `3px solid ${meta.color}`,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => hasDetail && setOpen((v) => !v)}
        aria-expanded={hasDetail ? open : undefined}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 16px',
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
            fontFamily: FONTS.mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: meta.color,
            width: 64,
          }}
        >
          {meta.label}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 15, color: COLORS.text }}>
            {finding.title}
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11.5,
              color: COLORS.mutedDim,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {finding.filePath}
            {line && <span style={{ color: COLORS.muted }}>:{line}</span>}
            <span style={{ color: 'rgba(120,160,220,0.35)' }}> · {finding.ruleId}</span>
          </span>
        </div>

        {hasDetail && (
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              color: COLORS.muted,
              fontSize: 12,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.25s ease',
            }}
          >
            ▾
          </span>
        )}
      </button>

      {hasDetail && open && (
        <div
          style={{
            padding: '0 16px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            animation: 'cb-rise 0.25s ease',
          }}
        >
          {finding.description && (
            <p style={{ margin: 0, fontFamily: FONTS.body, fontSize: 13.5, lineHeight: 1.6, color: COLORS.muted }}>
              {finding.description}
            </p>
          )}
          {finding.recommendation && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(34,211,238,0.06)',
                border: '1px solid rgba(34,211,238,0.18)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#22d3ee',
                  marginBottom: 6,
                }}
              >
                Recomendación
              </span>
              <p style={{ margin: 0, fontFamily: FONTS.body, fontSize: 13.5, lineHeight: 1.6, color: COLORS.text }}>
                {finding.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
