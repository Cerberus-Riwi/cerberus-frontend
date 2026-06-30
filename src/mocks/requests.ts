import type { ScanRequest } from '../types/cerberus'

// Contexto de origen de cada escaneo (scan-request.schema.json).
// Es un contrato distinto al veredicto; se relaciona por scanId.
// El frontend lo usa solo para enriquecer la lista (repo, rama, commit).

export const MOCK_REQUESTS: Record<string, ScanRequest> = {
  'a3f2e1d0-1234-4abc-8def-000000000001': {
    scanId: 'a3f2e1d0-1234-4abc-8def-000000000001',
    repositoryUrl: 'https://github.com/cerberus-riwi/cerberus-securitygate',
    branch: 'develop',
    commitHash: 'a3f2e1d0b4c5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    requestedAt: '2026-06-18T14:30:00Z',
    metadata: { prNumber: 42, triggeredBy: 'camilo.florez' },
  },
  'b7c8d9e0-2345-4bcd-9ef0-000000000002': {
    scanId: 'b7c8d9e0-2345-4bcd-9ef0-000000000002',
    repositoryUrl: 'https://github.com/cerberus-riwi/cerberus-vulnerability',
    branch: 'feat/CER-18-trivy-runner',
    commitHash: 'b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
    requestedAt: '2026-06-22T09:12:30Z',
    metadata: { prNumber: 57, triggeredBy: 'luis.gonzalez' },
  },
  'c1d2e3f4-3456-4cde-a012-000000000003': {
    scanId: 'c1d2e3f4-3456-4cde-a012-000000000003',
    repositoryUrl: 'https://github.com/cerberus-riwi/cerberus-codequality',
    branch: 'develop',
    commitHash: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    requestedAt: '2026-06-25T17:47:00Z',
    metadata: { triggeredBy: 'juan.cadena' },
  },
  'd4e5f6a7-4567-4def-b123-000000000004': {
    scanId: 'd4e5f6a7-4567-4def-b123-000000000004',
    repositoryUrl: 'https://github.com/cerberus-riwi/cerberus-frontend',
    branch: 'feat/CER-01-auth-login-register',
    commitHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    requestedAt: '2026-06-28T11:01:00Z',
    metadata: { prNumber: 12, triggeredBy: 'faiber.camacho' },
  },
  'e7f8a9b0-5678-4ef0-c234-000000000005': {
    scanId: 'e7f8a9b0-5678-4ef0-c234-000000000005',
    repositoryUrl: 'https://github.com/cerberus-riwi/cerberus-ml',
    branch: 'main',
    commitHash: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    requestedAt: '2026-06-29T20:35:00Z',
    metadata: { triggeredBy: 'miguel.angel' },
  },
}
