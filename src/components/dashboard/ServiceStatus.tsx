import type { ScanResult } from '../../types/cerberus'
import { STATUS_META, SERVICE_META, FONTS, COLORS } from '../../lib/theme'
import { formatDateTime } from '../../lib/verdict'

interface ServiceStatusProps {
  result: ScanResult
}

/** Estado de un servicio de análisis dentro del veredicto. */
export function ServiceStatus({ result }: ServiceStatusProps) {
  const status = STATUS_META[result.status]
  const service = SERVICE_META[result.serviceId]
  const findingCount = result.findings.length

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '16px 18px',
        borderRadius: 14,
        background: COLORS.panel,
        border: `1px solid ${COLORS.hairlineSoft}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 9,
            background: `${status.color}1f`,
            border: `1px solid ${status.color}66`,
            color: status.color,
            fontSize: 15,
          }}
        >
          {status.glyph}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: COLORS.text,
            }}
          >
            {service.label}
          </span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.mutedDim }}>
            {service.tool}
          </span>
        </div>

        <span
          style={{
            marginLeft: 'auto',
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: status.color,
          }}
        >
          {status.label}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.muted,
        }}
      >
        <span>
          {findingCount} {findingCount === 1 ? 'hallazgo' : 'hallazgos'}
        </span>
        <span>{formatDateTime(result.completedAt)}</span>
      </div>

      {result.errorMessage && (
        <p
          style={{
            margin: 0,
            padding: '9px 12px',
            borderRadius: 9,
            background: `${status.color}12`,
            borderLeft: `2px solid ${status.color}`,
            fontFamily: FONTS.body,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: COLORS.muted,
          }}
        >
          {result.errorMessage}
        </p>
      )}
    </div>
  )
}
