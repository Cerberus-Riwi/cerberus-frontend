import type { Severity, Verdict, ScanStatus, ServiceId } from '../types/cerberus'

// ─────────────────────────────────────────────────────────────
// Tokens de diseño — Cerberus (rediseño claro minimalista)
// Shell de dos tonos: sidebar oscuro + contenido claro.
// Un acento de marca (índigo); los veredictos usan color semántico.
// ─────────────────────────────────────────────────────────────

export const COLORS = {
  // Superficies
  appBg: '#F5F6F8',
  surface: '#FFFFFF',
  surfaceSubtle: '#FAFBFC',
  sidebar: '#0E1525',
  sidebarRaised: 'rgba(255,255,255,0.05)',

  // Bordes
  border: '#E6E8EC',
  borderStrong: '#D6DAE0',

  // Texto sobre claro
  ink: '#0E1525',
  text: '#222A37',
  textMuted: '#5B6472',
  textFaint: '#8A94A6',

  // Texto sobre sidebar
  onDark: '#EAEDF3',
  onDarkMuted: '#99A2B2',

  // Marca / interacción
  brand: '#4F46E5',
  brandHover: '#4338CA',
  brandSoft: '#EEEFFE',
} as const

export const FONTS = {
  sans: "'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

export const RADIUS = { sm: 8, md: 12, lg: 16, pill: 999 } as const

export interface VerdictMeta {
  /** etiqueta legible en español */
  label: string
  /** término técnico del contrato */
  code: Verdict
  color: string
  soft: string
}

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  pass: { label: 'Aprobado', code: 'pass', color: '#16A34A', soft: '#E9F7EE' },
  warning: { label: 'Advertencia', code: 'warning', color: '#D97706', soft: '#FDF2E3' },
  fail: { label: 'Rechazado', code: 'fail', color: '#DC2626', soft: '#FDECEC' },
}

export interface SeverityMeta {
  label: string
  color: string
  soft: string
  order: number
}

export const SEVERITY_META: Record<Severity, SeverityMeta> = {
  critical: { label: 'Crítica', color: '#BE123C', soft: '#FCE7EC', order: 0 },
  high: { label: 'Alta', color: '#EA580C', soft: '#FDEEE3', order: 1 },
  medium: { label: 'Media', color: '#CA8A04', soft: '#FBF3DC', order: 2 },
  low: { label: 'Baja', color: '#2563EB', soft: '#E7EEFD', order: 3 },
  info: { label: 'Info', color: '#64748B', soft: '#EEF1F5', order: 4 },
}

export const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

export interface StatusMeta {
  label: string
  color: string
  soft: string
}

export const STATUS_META: Record<ScanStatus, StatusMeta> = {
  success: { label: 'Completado', color: '#16A34A', soft: '#E9F7EE' },
  failed: { label: 'Error', color: '#DC2626', soft: '#FDECEC' },
  timeout: { label: 'Timeout', color: '#D97706', soft: '#FDF2E3' },
}

export const SERVICE_META: Record<ServiceId, { label: string; tool: string }> = {
  'vulnerability-service': { label: 'Vulnerability', tool: 'Trivy · ZAP · Gitleaks' },
  'codequality-service': { label: 'Code Quality', tool: 'Semgrep · análisis estático' },
}
