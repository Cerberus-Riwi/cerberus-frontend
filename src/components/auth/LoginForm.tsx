import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'
import { useAuth } from '../../lib/useAuth'
import { ApiError } from '../../lib/api'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate({ to: '/admin' })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Correo o contraseña incorrectos.')
      } else {
        setError('Error al conectar con el servidor. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: 'min(420px, 88%)' }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.24em',
        color: 'var(--accent)',
        textTransform: 'uppercase',
      }}>
        // acceso seguro
      </div>

      <h1 style={{
        margin: '14px 0 0',
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 600,
        fontSize: 46,
        lineHeight: 0.96,
        letterSpacing: '0.01em',
        textTransform: 'uppercase',
        color: '#e9eef8',
      }}>
        Bienvenido<br />de vuelta
      </h1>

      <p style={{ margin: '14px 0 32px', fontSize: 15, lineHeight: 1.55, color: '#9fb0cc' }}>
        El guardián reconoce a los suyos. Identifícate para cruzar el portal.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <AuthInput
          label="Correo"
          type="email"
          placeholder="tu@dominio.dev"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <AuthInput
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && (
          <div style={{
            fontSize: 13, color: '#ef4444',
            padding: '10px 14px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.24)',
            borderRadius: 8,
          }}>
            {error}
          </div>
        )}

        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Entrar'}
        </AuthButton>
      </form>
    </div>
  )
}
