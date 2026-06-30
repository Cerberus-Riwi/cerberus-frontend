import { Link } from '@tanstack/react-router'
import type { ScanVerdict, ScanRequest } from '../../types/cerberus'
import { VERDICT_META, SEVERITY_ORDER, FONTS, COLORS } from '../../lib/theme'
import { relativeTime, shortHash, totalFindings } from '../../lib/verdict'
import { Gate } from './Gate'
import { SeverityChip } from './SeverityChip'

interface ScanCardProps {
  verdict: ScanVerdict
  request?: ScanRequest
  now: Date
}

function repoName(url?: string): string {
  if (!url) return 'repositorio desconocido'
  return url.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
}

/** Tarjeta-resumen de un escaneo en la lista. */
export function ScanCard({ verdict, request, now }: ScanCardProps) {
  const meta = VERDICT_META[verdict.verdict]
  const total = totalFindings(verdict.summary)
  const present = SEVERITY_ORDER.filter((s) => verdict.summary[s] > 0)

  return (
    <Link
      to="/scans/$scanId"
      params={{ scanId: verdict.scanId }}
      style={{
        display: 'flex',
        gap: 18,
        alignItems: 'center',
        padding: '18px 20px',
        borderRadius: 16,
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairlineSoft}`,
        borderLeft: `3px solid ${meta.accent}`,
        textDecoration: 'none',
        color: COLORS.text,
        transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.panelRaised
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderLeftColor = meta.accent
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.panel
        e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Badge de puerta */}
      <div style={{ flexShrink: 0, width: 52 }}>
        <Gate verdict={verdict.verdict} size={52} />
      </div>

      {/* Identidad del escaneo */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: meta.accent,
            }}
          >
            {meta.label}
          </span>
          {verdict.rollbackTriggered && (
            <span title="Rollback ejecutado" style={{ fontSize: 12, color: meta.accent }}>⚡</span>
          )}
        </div>

        <span
          style={{
            fontFamily: FONTS.body,
            fontSize: 14.5,
            color: COLORS.text,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {repoName(request?.repositoryUrl)}
        </span>

        <span style={{ fontFamily: FONTS.mono, fontSize: 11.5, color: COLORS.mutedDim }}>
          {request?.branch ?? '—'}
          {request && <span> · {shortHash(request.commitHash)}</span>}
          <span> · {relativeTime(verdict.issuedAt, now)}</span>
        </span>
      </div>

      {/* Severidades */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          gap: 6,
          maxWidth: 180,
        }}
      >
        {total === 0 ? (
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.muted }}>limpio</span>
        ) : (
          present.map((sev) => <SeverityChip key={sev} severity={sev} count={verdict.summary[sev]} dense />)
        )}
      </div>
    </Link>
  )
}
