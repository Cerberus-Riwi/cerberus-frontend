import { Link } from '@tanstack/react-router'
import type { ScanVerdict, ScanRequest, Finding } from '../../types/cerberus'
import { VERDICT_META, SEVERITY_META, FONTS, COLORS } from '../../lib/theme'
import { formatDateTime, shortHash, hasIncompleteService } from '../../lib/verdict'
import { Gate } from './Gate'
import { SeverityMeter } from './SeverityMeter'
import { ServiceStatus } from './ServiceStatus'
import { FindingRow } from './FindingRow'

interface ScanDetailProps {
  verdict: ScanVerdict
  request?: ScanRequest
}

/** Ordena todos los findings del veredicto de mayor a menor severidad. */
function collectFindings(verdict: ScanVerdict): Finding[] {
  return verdict.results
    .flatMap((r) => r.findings)
    .sort((a, b) => SEVERITY_META[a.severity].order - SEVERITY_META[b.severity].order)
}

function repoName(url?: string): string | null {
  if (!url) return null
  return url.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
}

export function ScanDetail({ verdict, request }: ScanDetailProps) {
  const meta = VERDICT_META[verdict.verdict]
  const findings = collectFindings(verdict)
  const incomplete = hasIncompleteService(verdict)
  const repo = repoName(request?.repositoryUrl)

  const rootStyle = {
    minHeight: '100vh',
    background:
      'radial-gradient(120% 80% at 50% -10%, #0a1424 0%, #04060b 55%, #060406 100%)',
    color: COLORS.text,
    fontFamily: FONTS.body,
    '--accent': meta.accent,
    '--accent2': meta.accent2,
  } as React.CSSProperties

  return (
    <div style={rootStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 24px 80px' }}>
        {/* Volver */}
        <Link
          to="/scans"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: FONTS.mono,
            fontSize: 12,
            letterSpacing: '0.06em',
            color: COLORS.muted,
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          ← Escaneos
        </Link>

        {/* Hero — The Gate + veredicto */}
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 28,
            alignItems: 'center',
            margin: '24px 0 8px',
            animation: 'cb-rise 0.5s ease',
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <Gate verdict={verdict.verdict} size={170} animated />
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                letterSpacing: '0.18em',
                color: COLORS.muted,
                textTransform: 'uppercase',
              }}
            >
              Veredicto del Security Gate
            </span>
            <h1
              style={{
                fontFamily: FONTS.display,
                fontSize: 'clamp(48px, 9vw, 86px)',
                fontWeight: 600,
                lineHeight: 0.95,
                letterSpacing: '0.02em',
                margin: '6px 0 10px',
                color: meta.accent,
                textShadow: `0 0 40px ${meta.accent}55`,
              }}
            >
              {meta.label}
            </h1>
            <p style={{ margin: '0 0 16px', fontSize: 16, lineHeight: 1.5, color: COLORS.text, maxWidth: 460 }}>
              {meta.blurb}
            </p>

            {verdict.rollbackTriggered && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 14px',
                  borderRadius: 999,
                  background: `${meta.accent}1a`,
                  border: `1px solid ${meta.accent}66`,
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: meta.accent,
                }}
              >
                ⚡ Rollback ejecutado en Kubernetes
              </span>
            )}
          </div>
        </header>

        {/* Metadatos del escaneo */}
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 1,
            margin: '28px 0',
            background: COLORS.hairlineSoft,
            border: `1px solid ${COLORS.hairlineSoft}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <MetaItem label="Repositorio" value={repo ?? '—'} />
          <MetaItem label="Rama" value={request?.branch ?? '—'} mono />
          <MetaItem label="Commit" value={request ? shortHash(request.commitHash) : '—'} mono />
          <MetaItem label="Scan ID" value={verdict.scanId.split('-')[0]} mono />
          <MetaItem label="Emitido" value={formatDateTime(verdict.issuedAt)} />
          {request?.metadata?.triggeredBy && (
            <MetaItem label="Disparado por" value={request.metadata.triggeredBy} mono />
          )}
        </dl>

        {/* Aviso de análisis incompleto */}
        {incomplete && (
          <div
            role="alert"
            style={{
              display: 'flex',
              gap: 12,
              padding: '14px 16px',
              marginBottom: 24,
              borderRadius: 12,
              background: 'rgba(245,177,74,0.08)',
              border: '1px solid rgba(245,177,74,0.35)',
            }}
          >
            <span aria-hidden style={{ color: '#f5b14a', fontSize: 16 }}>⚠</span>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: '#f5d9a8' }}>
              Un servicio no completó su análisis (timeout o error). El veredicto puede no reflejar
              la totalidad del repositorio — revisa el estado de cada servicio abajo.
            </p>
          </div>
        )}

        {/* Resumen de severidad */}
        <Section title="Resumen de severidad">
          <SeverityMeter summary={verdict.summary} />
        </Section>

        {/* Servicios */}
        <Section title="Servicios de análisis">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 12,
            }}
          >
            {verdict.results.map((r) => (
              <ServiceStatus key={r.serviceId} result={r} />
            ))}
          </div>
        </Section>

        {/* Hallazgos */}
        <Section title={`Hallazgos (${findings.length})`}>
          {findings.length === 0 ? (
            <div
              style={{
                padding: '28px 20px',
                borderRadius: 14,
                background: COLORS.panel,
                border: `1px solid ${COLORS.hairlineSoft}`,
                textAlign: 'center',
                color: COLORS.muted,
                fontSize: 14,
              }}
            >
              Sin hallazgos. El Cerbero no encontró nada que reportar en este escaneo.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {findings.map((f) => (
                <FindingRow key={f.id} finding={f} />
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 34 }}>
      <h2
        style={{
          fontFamily: FONTS.display,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: COLORS.muted,
          margin: '0 0 16px',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ padding: '12px 16px', background: COLORS.obsidian }}>
      <dt
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: COLORS.mutedDim,
          marginBottom: 5,
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontFamily: mono ? FONTS.mono : FONTS.body,
          fontSize: 13.5,
          color: COLORS.text,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </dd>
    </div>
  )
}
