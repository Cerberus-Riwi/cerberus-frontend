import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'
import type { LoginCredentials } from '../../types/cerberus'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: conectar con cerberus-securitygate auth endpoint
    navigate({ to: '/scans' })
  }

  return (
    <div style={{ width: 'min(420px, 88%)' }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.24em',
        color: 'var(--accent)',
        textTransform: 'uppercase',
        transition: 'color 0.6s ease',
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
          value={form.email}
          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />

        <AuthInput
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
          required
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#9fb0cc' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
              style={{ accentColor: 'var(--accent)', width: 15, height: 15 }}
            />
            Recordarme
          </label>
          <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none', transition: 'color 0.6s ease' }}>
            ¿Olvidaste?
          </a>
        </div>

        <AuthButton type="submit">Entrar</AuthButton>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#7e90ad' }}>
        ¿No tienes cuenta?{' '}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onSwitchToRegister() }}
          style={{ color: '#e9eef8', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: 1 }}
        >
          Crear una
        </a>
      </div>
    </div>
  )
}
