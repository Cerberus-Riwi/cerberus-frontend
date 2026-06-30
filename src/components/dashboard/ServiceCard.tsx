import type { ScanResult } from '../../types/cerberus'
import { STATUS_META, SERVICE_META, COLORS, FONTS, RADIUS } from '../../lib/theme'
import { formatDateTime } from '../../lib/verdict'

interface ServiceCardProps {
  result: ScanResult
}

export function ServiceCard({ result }: ServiceCardProps) {
  const status = STATUS_META[result.status]
  const service = SERVICE_META[result.serviceId]
  const count = result.findings.length

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '16px 18px',
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontFamily: FONTS.sans, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
            {service.label}
          </span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textFaint }}>{service.tool}</span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: RADIUS.pill,
            background: status.soft,
            color: status.color,
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: status.color }} />
          {status.label}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.mono, fontSize: 11.5, color: COLORS.textMuted }}>
        <span>{count} {count === 1 ? 'hallazgo' : 'hallazgos'}</span>
        <span>{formatDateTime(result.completedAt)}</span>
      </div>

      {result.errorMessage && (
        <p
          style={{
            margin: 0,
            padding: '9px 12px',
            borderRadius: RADIUS.sm,
            background: status.soft,
            fontFamily: FONTS.sans,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: COLORS.text,
          }}
        >
          {result.errorMessage}
        </p>
      )}
    </div>
  )
}
