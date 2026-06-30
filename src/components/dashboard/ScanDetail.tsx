import { Link } from '@tanstack/react-router'
import type { ScanVerdict, ScanRequest, Finding } from '../../types/cerberus'
import { VERDICT_META, SEVERITY_META, SEVERITY_ORDER, COLORS, FONTS, RADIUS } from '../../lib/theme'
import { formatDateTime, shortHash, hasIncompleteService, verifySummary, totalFindings } from '../../lib/verdict'
import { SeverityBar } from './SeverityBar'
import { SeverityBadge } from '../ui/SeverityBadge'
import { ServiceCard } from './ServiceCard'
import { FindingItem } from './FindingItem'

interface ScanDetailProps {
  verdict: ScanVerdict
  request?: ScanRequest
}

function collectFindings(verdict: ScanVerdict): Finding[] {
  return verdict.results
    .flatMap((r) => r.findings)
    .sort((a, b) => SEVERITY_META[a.severity].order - SEVERITY_META[b.severity].order)
}

function repoName(url?: string): string {
  if (!url) return 'repositorio desconocido'
  return url.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
}

export function ScanDetail({ verdict, request }: ScanDetailProps) {
  const meta = VERDICT_META[verdict.verdict]
  const findings = collectFindings(verdict)
  const incomplete = hasIncompleteService(verdict)
  const integrity = verifySummary(verdict)
  const total = totalFindings(verdict.summary)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 28px',
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link to="/scans" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 500, color: COLORS.textMuted, textDecoration: 'none' }}>
          ‹ Escaneos
        </Link>
        <span style={{ color: COLORS.border }}>/</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 12.5, color: COLORS.textFaint }}>
          {verdict.scanId.split('-')[0]}
        </span>
      </header>

      <div style={{ padding: '24px 28px 56px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 960, animation: 'cb-rise 0.3s ease' }}>
        {/* Cabecera de veredicto */}
        <section
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            alignItems: 'center',
            padding: '22px 24px',
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderLeft: `4px solid ${meta.color}`,
            borderRadius: RADIUS.lg,
          }}
        >
          <span
            aria-hidden
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: '50%', background: meta.soft, color: meta.color, fontSize: 24, flexShrink: 0 }}
          >
            {verdict.verdict === 'pass' ? '✓' : verdict.verdict === 'warning' ? '!' : '✕'}
          </span>

          <div style={{ flex: 1, minWidth: 220 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textFaint }}>
              Veredicto del Security Gate
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', margin: '2px 0 4px' }}>
              <h1 style={{ fontFamily: FONTS.sans, fontSize: 26, fontWeight: 600, color: meta.color }}>
                {meta.label}
              </h1>
              <span style={{ fontFamily: FONTS.sans, fontSize: 16, fontWeight: 600, color: COLORS.ink }}>
                {repoName(request?.repositoryUrl)}
              </span>
            </div>
            <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>
              {request?.branch ?? '—'}
              {request && <span> · {shortHash(request.commitHash)}</span>}
              <span> · {formatDateTime(verdict.issuedAt)}</span>
              {request?.metadata?.triggeredBy && <span> · {request.metadata.triggeredBy}</span>}
            </span>
          </div>

          {verdict.rollbackTriggered && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: RADIUS.pill, background: meta.soft, color: meta.color, fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 600 }}>
              ⚡ Rollback ejecutado
            </span>
          )}
        </section>

        {/* Aviso de análisis incompleto */}
        {incomplete && (
          <div role="alert" style={{ display: 'flex', gap: 11, padding: '13px 16px', borderRadius: RADIUS.md, background: '#FDF2E3', border: '1px solid #F2D9A8' }}>
            <span aria-hidden style={{ color: '#B45309', fontSize: 15 }}>⚠</span>
            <p style={{ margin: 0, fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.55, color: '#8A5A11' }}>
              Un servicio no completó su análisis (timeout o error). El veredicto puede no reflejar la
              totalidad del repositorio — revisa el estado de cada servicio.
            </p>
          </div>
        )}

        {/* Resumen de severidad */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <SectionTitle>Resumen de severidad</SectionTitle>
            <IntegrityBadge ok={integrity.ok} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <SeverityBar summary={verdict.summary} height={8} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {SEVERITY_ORDER.map((sev) => (
              <SeverityBadge key={sev} severity={sev} count={verdict.summary[sev]} />
            ))}
            <span style={{ marginLeft: 'auto', fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>
              {total} {total === 1 ? 'hallazgo' : 'hallazgos'}
            </span>
          </div>
        </Card>

        {/* Servicios */}
        <div>
          <SectionTitle>Servicios de análisis</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
            {verdict.results.map((r) => (
              <ServiceCard key={r.serviceId} result={r} />
            ))}
          </div>
        </div>

        {/* Hallazgos */}
        <div>
          <SectionTitle>Hallazgos · {findings.length}</SectionTitle>
          <div style={{ marginTop: 12 }}>
            {findings.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, color: COLORS.textMuted, fontFamily: FONTS.sans, fontSize: 14 }}>
                Sin hallazgos. El escaneo no reportó problemas.
              </div>
            ) : (
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, overflow: 'hidden' }}>
                {findings.map((f, i) => (
                  <FindingItem key={f.id} finding={f} last={i === findings.length - 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ padding: '18px 20px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg }}>
      {children}
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{children}</h2>
  )
}

function IntegrityBadge({ ok }: { ok: boolean }) {
  const color = ok ? '#16A34A' : '#D97706'
  return (
    <span
      title={ok ? 'El resumen coincide con el conteo real de hallazgos' : 'El resumen no coincide con los hallazgos reportados'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONTS.mono, fontSize: 11, color, whiteSpace: 'nowrap' }}
    >
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {ok ? 'Resumen verificado' : 'Resumen inconsistente'}
    </span>
  )
}
