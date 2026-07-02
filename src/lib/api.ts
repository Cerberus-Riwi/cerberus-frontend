import { getToken } from './auth'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5275'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> ?? {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, body?.error ?? res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string
  expiresAt: string
  user: { id: string; email: string; role: 'user' | 'admin' }
}

export function login(email: string, password: string) {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// ── Scans ─────────────────────────────────────────────────────────────────────

export interface CreateScanPayload {
  repositoryUrl: string
  branch: string
  commitHash: string
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
  return request<ScanCreated>('/api/scan/request', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      requestedAt: new Date().toISOString(),
    }),
  })
}

export function getScanStatus(scanId: string) {
  return request<ScanStatus>(`/api/scan/${scanId}/status`)
}

// ── Findings ──────────────────────────────────────────────────────────────────

export function getScanFindings(scanId: string) {
  return request<unknown>(`/api/v1/vulnerabilities/${scanId}`)
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

// ── AI Chat (cerberus-ml) ─────────────────────────────────────────────────────

export interface ChatFinding {
  severity: string
  title: string
  ruleId?: string
  filePath?: string
  lineStart?: number
  recommendation?: string
}

export interface ChatResponse {
  reply: string
}

export function sendChatMessage(message: string, findings?: ChatFinding[]) {
  return request<ChatResponse>('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, findings }),
  })
}

export const kpi = {
  dashboard:    () => request<KpiDashboard>('/api/kpis/dashboard'),
  verdicts:     () => request<VerdictSummary[]>('/api/kpis/verdicts'),
  severity:     () => request<SeveritySummary[]>('/api/kpis/severity'),
  topRules:     (limit = 10) => request<TopRule[]>(`/api/kpis/top-rules?limit=${limit}`),
  repositories: () => request<RepositorySummary[]>('/api/kpis/repositories'),
  history:      () => request<HistorySummary[]>('/api/kpis/history'),
  health:       () => request<unknown>('/api/kpis/health'),
}
