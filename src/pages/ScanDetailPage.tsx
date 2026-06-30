import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import type { ScanVerdict, ScanRequest } from '../types/cerberus'
import { getScanVerdict, getScanRequest } from '../lib/scans'
import { FONTS, COLORS } from '../lib/theme'
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
      if (!verdict) {
        setState({ phase: 'missing' })
        return
      }
      setState({ phase: 'ready', verdict, request: getScanRequest(scanId) })
    })
    return () => {
      active = false
    }
  }, [scanId])

  if (state.phase === 'loading') {
    return <CenteredNote text="Cargando veredicto…" />
  }

  if (state.phase === 'missing') {
    return (
      <CenteredNote
        text={`No se encontró ningún escaneo con ID ${scanId.split('-')[0]}.`}
        showBack
      />
    )
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
        gap: 18,
        background: 'radial-gradient(120% 80% at 50% -10%, #0a1424 0%, #04060b 55%, #060406 100%)',
        color: COLORS.muted,
        fontFamily: FONTS.mono,
        fontSize: 14,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <span>{text}</span>
      {showBack && (
        <Link
          to="/scans"
          style={{
            fontFamily: FONTS.mono,
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#22d3ee',
            textDecoration: 'none',
          }}
        >
          ← Volver a escaneos
        </Link>
      )}
    </div>
  )
}
