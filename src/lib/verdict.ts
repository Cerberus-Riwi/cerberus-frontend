import type { ScanVerdict, SeveritySummary, Severity } from '../types/cerberus'
import { SEVERITY_ORDER } from './theme'

/** Total de hallazgos sumando todas las severidades del resumen. */
export function totalFindings(summary: SeveritySummary): number {
  return SEVERITY_ORDER.reduce((acc, sev) => acc + summary[sev], 0)
}

/**
 * Recalcula el resumen a partir de los findings reales de cada result.
 * Útil como verificación de consistencia frente al campo summary recibido.
 */
export function computeSummary(verdict: ScanVerdict): SeveritySummary {
  const out: SeveritySummary = { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
  for (const result of verdict.results) {
    for (const finding of result.findings) {
      out[finding.severity] += 1
    }
  }
  return out
}

/** ¿Algún servicio no terminó con éxito? (timeout/failed → análisis incompleto). */
export function hasIncompleteService(verdict: ScanVerdict): boolean {
  return verdict.results.some((r) => r.status !== 'success')
}

export interface SummaryCheck {
  ok: boolean
  received: SeveritySummary
  computed: SeveritySummary
}

/**
 * Audita que el summary emitido por el SecurityGate coincida con el conteo
 * real de findings. Si no coincide, el veredicto pudo construirse sobre datos
 * inconsistentes. Es la verificación de confianza del dashboard.
 */
export function verifySummary(verdict: ScanVerdict): SummaryCheck {
  const computed = computeSummary(verdict)
  const ok = SEVERITY_ORDER.every((sev) => verdict.summary[sev] === computed[sev])
  return { ok, received: verdict.summary, computed }
}

/** Severidad más alta presente en el resumen, o null si no hay hallazgos. */
export function topSeverity(summary: SeveritySummary): Severity | null {
  for (const sev of SEVERITY_ORDER) {
    if (summary[sev] > 0) return sev
  }
  return null
}

/** Primeros 8 caracteres del UUID, en mayúsculas, para mostrar en compacto. */
export function shortId(uuid: string): string {
  return uuid.split('-')[0]?.toUpperCase() ?? uuid
}

/** Hash de commit abreviado a 7 caracteres, estilo git. */
export function shortHash(hash: string): string {
  return hash.slice(0, 7)
}

const DATE_FMT = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** Formatea un ISO 8601 a fecha legible en español. Devuelve '—' si es inválido. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return DATE_FMT.format(d)
}

/** Tiempo relativo simple ("hace 3 h"). Pensado para la lista de escaneos. */
export function relativeTime(iso: string, now: Date): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'recién'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}
