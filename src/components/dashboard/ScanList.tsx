import { Link } from '@tanstack/react-router'
import type { ScanVerdict, ScanRequest } from '../../types/cerberus'
import { COLORS, FONTS, RADIUS, SEVERITY_ORDER } from '../../lib/theme'
import { relativeTime, shortHash, totalFindings } from '../../lib/verdict'
import { StatusPill } from '../ui/StatusPill'
import { SeverityBadge } from '../ui/SeverityBadge'

export interface ScanRow {
  verdict: ScanVerdict
  request?: ScanRequest
}

interface ScanListProps {
  rows: ScanRow[]
  now: Date
}

function repoName(url?: string): string {
  if (!url) return 'repositorio desconocido'
  return url.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
}

export function ScanList({ rows, now }: ScanListProps) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
      }}
    >
      {rows.map((row, i) => {
        const { verdict, request } = row
        const total = totalFindings(verdict.summary)
        const present = SEVERITY_ORDER.filter((s) => verdict.summary[s] > 0).slice(0, 3)

        return (
          <Link
            key={verdict.scanId}
            to="/scans/$scanId"
            params={{ scanId: verdict.scanId }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 20px',
              textDecoration: 'none',
              color: COLORS.text,
              borderTop: i === 0 ? 'none' : `1px solid ${COLORS.border}`,
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.surfaceSubtle)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Estado */}
            <div style={{ width: 130, flexShrink: 0 }}>
              <StatusPill verdict={verdict.verdict} />
            </div>

            {/* Repo + metadatos */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: COLORS.ink,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {repoName(request?.repositoryUrl)}
              </span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11.5, color: COLORS.textFaint }}>
                {request?.branch ?? '—'}
                {request && <span> · {shortHash(request.commitHash)}</span>}
                {verdict.rollbackTriggered && <span style={{ color: VERDICT_FAIL }}> · rollback</span>}
              </span>
            </div>

            {/* Severidades */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {total === 0 ? (
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textFaint }}>limpio</span>
              ) : (
                present.map((sev) => <SeverityBadge key={sev} severity={sev} count={verdict.summary[sev]} />)
              )}
            </div>

            {/* Tiempo + chevron */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, width: 120, justifyContent: 'flex-end' }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11.5, color: COLORS.textFaint }}>
                {relativeTime(verdict.issuedAt, now)}
              </span>
              <span aria-hidden style={{ color: COLORS.textFaint, fontSize: 14 }}>›</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

const VERDICT_FAIL = '#DC2626'
