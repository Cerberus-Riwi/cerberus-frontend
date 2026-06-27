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

// Contratos v1 — FROZEN
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type Verdict = 'pass' | 'fail' | 'warning'
export type ScanStatus = 'success' | 'failed' | 'timeout'

export interface Finding {
  id: string
  severity: Severity
  title: string
  description?: string
  ruleId: string
  filePath?: string
  locationUrl?: string
  lineStart?: number
  lineEnd?: number
  recommendation?: string
}

export interface ScanResult {
  scanId: string
  serviceId: 'vulnerability-service' | 'codequality-service'
  status: ScanStatus
  findings: Finding[]
  completedAt: string
  errorMessage?: string
}

export interface ScanVerdict {
  scanId: string
  verdict: Verdict
  summary: {
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
  results: ScanResult[]
  rollbackTriggered: boolean
  issuedAt: string
}
