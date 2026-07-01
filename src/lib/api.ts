import { getToken } from './auth'

const SECURITY_GATE = import.meta.env.VITE_SECURITY_GATE_URL ?? 'http://localhost:5000'
const ML_API        = import.meta.env.VITE_ML_API_URL        ?? 'http://localhost:8000'
const VULN_API      = import.meta.env.VITE_VULN_API_URL      ?? 'http://localhost:5001'

async function request<T>(baseUrl: string, path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> ?? {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${baseUrl}${path}`, { ...init, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, body?.error ?? res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string
  expiresAt: string
  user: { id: string; email: string; role: 'user' | 'admin' }
}

export function login(email: string, password: string) {
  return request<LoginResponse>(SECURITY_GATE, '/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// ── Scans ─────────────────────────────────────────────────────────────────────

export interface CreateScanPayload {
  repositoryUrl: string
  branch: string
  triggeredBy?: string
}

export interface ScanCreated {
  scanId: string
  status: string
  receivedAt: string
}

export interface ScanStatus {
  scanId: string
  status: string
  receivedAt: string
  services: string[]
}

export function createScan(payload: CreateScanPayload) {
  return request<ScanCreated>(SECURITY_GATE, '/api/scan/request', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      requestedAt: new Date().toISOString(),
    }),
  })
}

export function getScanStatus(scanId: string) {
  return request<ScanStatus>(SECURITY_GATE, `/api/scan/${scanId}/status`)
}

// ── Findings ──────────────────────────────────────────────────────────────────

export function getScanFindings(scanId: string) {
  return request<unknown>(VULN_API, `/api/v1/vulnerabilities/${scanId}`)
}

// ── KPIs (cerberus-ml) ────────────────────────────────────────────────────────

export interface VerdictSummary    { verdict: string; total: number }
export interface SeveritySummary   { severity: string; total: number }
export interface TopRule           { rule_id: string; title: string; total_findings: number }
export interface RepositorySummary {
  repository_name: string; organization: string; repository_url: string
  total_findings: number; critical: number; high: number; medium: number; low: number; info: number
}
export interface HistorySummary {
  full_date: string
  total_findings: number; critical: number; high: number; medium: number; low: number; info: number
}
export interface KpiDashboard {
  verdicts: VerdictSummary[]; severity: SeveritySummary[]
  top_rules: TopRule[]; repositories: RepositorySummary[]; history: HistorySummary[]
}

export const kpi = {
  dashboard:    () => request<KpiDashboard>(ML_API, '/api/kpis/dashboard'),
  verdicts:     () => request<VerdictSummary[]>(ML_API, '/api/kpis/verdicts'),
  severity:     () => request<SeveritySummary[]>(ML_API, '/api/kpis/severity'),
  topRules:     (limit = 10) => request<TopRule[]>(ML_API, `/api/kpis/top-rules?limit=${limit}`),
  repositories: () => request<RepositorySummary[]>(ML_API, '/api/kpis/repositories'),
  history:      () => request<HistorySummary[]>(ML_API, '/api/kpis/history'),
  health:       () => request<unknown>(ML_API, '/api/kpis/health'),
}
