export type AuthMode = 'login' | 'register'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

// ─────────────────────────────────────────────────────────────
// Contratos v1 — FROZEN (cerberus-contracts, rama feat/v1-schemas)
// Estas formas reflejan exactamente los JSON Schemas congelados.
// No agregar campos que no estén en el contrato.
// ─────────────────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type Verdict = 'pass' | 'fail' | 'warning'
export type ScanStatus = 'success' | 'failed' | 'timeout'
export type ServiceId = 'vulnerability-service' | 'codequality-service'

/** scan-request.schema.json — SecurityGate → servicios de análisis */
export interface ScanRequest {
  scanId: string
  repositoryUrl: string
  branch: string
  commitHash: string
  requestedAt: string
  metadata?: {
    prNumber?: number
    triggeredBy?: string
  }
}

/** finding (dentro de cada scan-result) */
export interface Finding {
  id: string
  severity: Severity
  title: string
  description?: string
  ruleId: string
  filePath: string
  lineStart?: number
  lineEnd?: number
  recommendation?: string
}

/** scan-result.schema.json — servicios de análisis → SecurityGate */
export interface ScanResult {
  scanId: string
  serviceId: ServiceId
  status: ScanStatus
  findings: Finding[]
  completedAt: string
  errorMessage?: string
}

/** scan-verdict.schema.json — SecurityGate → Frontend y ML */
export interface SeveritySummary {
  critical: number
  high: number
  medium: number
  low: number
  info: number
}

export interface ScanVerdict {
  scanId: string
  verdict: Verdict
  summary: SeveritySummary
  results: ScanResult[]
  rollbackTriggered: boolean
  issuedAt: string
}
