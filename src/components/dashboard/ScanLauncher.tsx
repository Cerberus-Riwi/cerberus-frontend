import { useState } from 'react'
import { createScan, getScanStatus, ApiError } from '../../lib/api'
import { getUser } from '../../lib/auth'

type ScanPhase = 'idle' | 'loading' | 'polling' | 'done' | 'error'

interface Props {
  onScanComplete?: (scanId: string) => void
}

const VERDICT_COLOR: Record<string, string> = {
  pass:    '#22d3ee',
  warning: '#f59e0b',
  fail:    '#ef4444',
}

export function ScanLauncher({ onScanComplete }: Props) {
  const [url, setUrl]       = useState('')
  const [branch, setBranch] = useState('main')
  const [phase, setPhase]   = useState<ScanPhase>('idle')
  const [status, setStatus] = useState<string | null>(null)
  const [scanId, setScanId] = useState<string | null>(null)
  const [error, setError]   = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPhase('loading')

    try {
      const user = getUser()
      const res = await createScan({
        repositoryUrl: url,
        branch,
        triggeredBy: user?.email,
      })
      setScanId(res.scanId)
      setStatus(res.status)
      setPhase('polling')
      poll(res.scanId)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al iniciar el escaneo')
      setPhase('error')
    }
  }

  const poll = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const st = await getScanStatus(id)
        setStatus(st.status)
        if (st.status !== 'pending' && st.status !== 'running') {
          clearInterval(interval)
          setPhase('done')
          onScanComplete?.(id)
        }
      } catch {
        clearInterval(interval)
        setPhase('error')
        setError('Error al consultar el estado del escaneo')
      }
    }, 3000)
  }

  const reset = () => { setPhase('idle'); setUrl(''); setScanId(null); setStatus(null); setError(null) }

  const isBusy = phase === 'loading' || phase === 'polling'

  return (
    <div style={{
      background: 'rgba(12,18,32,0.8)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '32px 36px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 3, height: 28, background: '#3b82f6', borderRadius: 2 }} />
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: '#60a5fa', textTransform: 'uppercase', marginBottom: 2 }}>
            // nuevo escaneo
          </div>
          <h2 style={{ margin: 0, fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, textTransform: 'uppercase', color: '#e9eef8' }}>
            Analizar repositorio
          </h2>
        </div>
      </div>

      {phase !== 'done' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#7e90ad', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                URL del repositorio
              </label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://github.com/org/repositorio"
                required
                disabled={isBusy}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: '0 1 160px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#7e90ad', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="main"
                required
                disabled={isBusy}
                style={inputStyle}
              />
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 13, color: '#ef4444', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              type="submit"
              disabled={isBusy}
              style={{
                padding: '12px 32px',
                background: isBusy ? 'rgba(59,130,246,0.4)' : '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: isBusy ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {phase === 'loading' ? 'Enviando...' : phase === 'polling' ? 'Escaneando...' : 'Escanear →'}
            </button>

            {phase === 'polling' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9fb0cc' }}>
                <Spinner />
                <span>Estado: <strong style={{ color: '#60a5fa' }}>{status}</strong></span>
              </div>
            )}
          </div>
        </form>
      )}

      {phase === 'done' && scanId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>✓</div>
            <div>
              <div style={{ color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.1em' }}>ESCANEO COMPLETADO</div>
              <div style={{ fontSize: 12, color: '#7e90ad', marginTop: 2 }}>{scanId}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <a
                href={`/dashboard/${scanId}`}
                style={{ padding: '8px 20px', background: '#3b82f6', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontFamily: "'Oswald', sans-serif", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                Ver resultados
              </a>
              <button onClick={reset} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#9fb0cc', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                Nuevo escaneo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14,
      border: '2px solid rgba(96,165,250,0.3)',
      borderTop: '2px solid #60a5fa',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(4,6,11,0.6)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  color: '#e9eef8',
  fontSize: 14,
  fontFamily: "'JetBrains Mono', monospace",
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}
