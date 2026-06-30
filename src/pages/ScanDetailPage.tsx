import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import type { ScanVerdict, ScanRequest } from '../types/cerberus'
import { getScanVerdict, getScanRequest } from '../lib/scans'
import { COLORS, FONTS } from '../lib/theme'
import { ScanDetail } from '../components/dashboard/ScanDetail'

type LoadState =
  | { phase: 'loading' }
  | { phase: 'missing' }
  | { phase: 'ready'; verdict: ScanVerdict; request?: ScanRequest }

export function ScanDetailPage() {
  const { scanId } = useParams({ strict: false }) as { scanId: string }
  const [state, setState] = useState<LoadState>({ phase: 'loading' })

  useEffect(() => {
    let active = true
    setState({ phase: 'loading' })
    getScanVerdict(scanId).then((verdict) => {
      if (!active) return
      if (!verdict) return setState({ phase: 'missing' })
      setState({ phase: 'ready', verdict, request: getScanRequest(scanId) })
    })
    return () => {
      active = false
    }
  }, [scanId])

  if (state.phase === 'loading') return <CenteredNote text="Cargando veredicto…" />
  if (state.phase === 'missing') {
    return <CenteredNote text={`No se encontró ningún escaneo con ID ${scanId.split('-')[0]}.`} showBack />
  }
  return <ScanDetail verdict={state.verdict} request={state.request} />
}

function CenteredNote({ text, showBack }: { text: string; showBack?: boolean }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
        color: COLORS.textMuted,
        fontFamily: FONTS.sans,
        fontSize: 14,
      }}
    >
      <span>{text}</span>
      {showBack && (
        <Link to="/scans" style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 600, color: COLORS.brand, textDecoration: 'none' }}>
          ‹ Volver a escaneos
        </Link>
      )}
    </div>
  )
}
