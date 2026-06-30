import type { ScanVerdict, ScanRequest } from '../types/cerberus'
import { MOCK_VERDICTS } from '../mocks/verdicts'
import { MOCK_REQUESTS } from '../mocks/requests'

// ─────────────────────────────────────────────────────────────
// Seam de datos del dashboard.
// Hoy sirve fixtures locales; cuando exista el endpoint de lectura
// en cerberus-securitygate, este es el ÚNICO archivo a cambiar
// (las firmas async ya quedan listas para fetch real).
// ─────────────────────────────────────────────────────────────

/** Lista de veredictos, del más reciente al más antiguo. */
export async function getScanVerdicts(): Promise<ScanVerdict[]> {
  return [...MOCK_VERDICTS].sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
  )
}

/** Veredicto individual por scanId, o undefined si no existe. */
export async function getScanVerdict(scanId: string): Promise<ScanVerdict | undefined> {
  return MOCK_VERDICTS.find((v) => v.scanId === scanId)
}

/** Contexto de origen (repo/rama/commit) asociado a un escaneo. */
export function getScanRequest(scanId: string): ScanRequest | undefined {
  return MOCK_REQUESTS[scanId]
}
