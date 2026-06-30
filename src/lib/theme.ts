import type { Severity, Verdict, ScanStatus, ServiceId } from '../types/cerberus'

// ─────────────────────────────────────────────────────────────
// Tokens de diseño — Cerberus dashboard
// El veredicto conduce el acento. Base obsidiana, datos en mono.
// ─────────────────────────────────────────────────────────────

export const COLORS = {
  obsidian: '#04060b',
  panel: 'rgba(255,255,255,0.03)',
  panelRaised: 'rgba(255,255,255,0.05)',
  glass: 'rgba(4, 6, 11, 0.55)',
  hairline: 'rgba(120,160,220,0.18)',
  hairlineSoft: 'rgba(255,255,255,0.06)',
  text: '#e9eef8',
  muted: '#7e90ad',
  mutedDim: '#56627a',
} as const

export const FONTS = {
  display: "'Oswald', sans-serif",
  body: "'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

export interface VerdictMeta {
  label: string
  /** estado de la puerta: open / ajar / sealed */
  gate: 'open' | 'ajar' | 'sealed'
  accent: string
  accent2: string
  blurb: string
}

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  pass: {
    label: 'PASS',
    gate: 'open',
    accent: '#22d3ee',
    accent2: '#3b82f6',
    blurb: 'La puerta está abierta. El despliegue puede continuar.',
  },
  warning: {
    label: 'WARNING',
    gate: 'ajar',
    accent: '#f5b14a',
    accent2: '#ff8a3d',
    blurb: 'La puerta queda entreabierta. Hay hallazgos que revisar.',
  },
  fail: {
    label: 'FAIL',
    gate: 'sealed',
    accent: '#ff5a5f',
    accent2: '#e11d48',
    blurb: 'La puerta está sellada. El Cerbero bloquea el paso.',
  },
}

export interface SeverityMeta {
  label: string
  color: string
  order: number
}

export const SEVERITY_META: Record<Severity, SeverityMeta> = {
  critical: { label: 'Critical', color: '#f43f5e', order: 0 },
  high: { label: 'High', color: '#fb7138', order: 1 },
  medium: { label: 'Medium', color: '#f5b14a', order: 2 },
  low: { label: 'Low', color: '#38bdf8', order: 3 },
  info: { label: 'Info', color: '#7e90ad', order: 4 },
}

/** Orden de severidad de mayor a menor, útil para iterar el resumen. */
export const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

export interface StatusMeta {
  label: string
  color: string
  glyph: string
}

export const STATUS_META: Record<ScanStatus, StatusMeta> = {
  success: { label: 'Completado', color: '#22d3ee', glyph: '✓' },
  failed: { label: 'Error', color: '#ff5a5f', glyph: '✕' },
  timeout: { label: 'Timeout', color: '#f5b14a', glyph: '⏱' },
}

export const SERVICE_META: Record<ServiceId, { label: string; tool: string }> = {
  'vulnerability-service': { label: 'Vulnerability', tool: 'Trivy · ZAP · Gitleaks' },
  'codequality-service': { label: 'Code Quality', tool: 'Semgrep · análisis estático' },
}
