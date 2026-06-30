import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'
import { COLORS, FONTS } from '../../lib/theme'
import type { LoginCredentials } from '../../types/cerberus'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginCredentials>({ email: '', password: '', rememberMe: false })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: conectar con cerberus-securitygate auth endpoint
    navigate({ to: '/scans' })
  }

  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <h1 style={{ fontFamily: FONTS.sans, fontSize: 26, fontWeight: 600, color: COLORS.ink }}>
        Bienvenido de nuevo
      </h1>
      <p style={{ margin: '8px 0 28px', fontFamily: FONTS.sans, fontSize: 14.5, lineHeight: 1.5, color: COLORS.textMuted }}>
        Inicia sesión para revisar los veredictos del Security Gate.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthInput
          label="Correo"
          type="email"
          placeholder="tu@dominio.dev"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <AuthInput
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 13, color: COLORS.textMuted }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => setForm((f) => ({ ...f, rememberMe: e.target.checked }))}
              style={{ accentColor: COLORS.brand, width: 15, height: 15 }}
            />
            Recordarme
          </label>
          <a href="#" style={{ color: COLORS.brand, textDecoration: 'none', fontWeight: 500 }}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <AuthButton type="submit">Entrar</AuthButton>
      </form>

      <p style={{ textAlign: 'center', marginTop: 22, fontFamily: FONTS.sans, fontSize: 13.5, color: COLORS.textMuted }}>
        ¿No tienes cuenta?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onSwitchToRegister()
          }}
          style={{ color: COLORS.brand, textDecoration: 'none', fontWeight: 600 }}
        >
          Crear una
        </a>
      </p>
    </div>
  )
}
