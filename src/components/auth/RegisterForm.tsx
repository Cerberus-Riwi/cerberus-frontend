import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'
import { COLORS, FONTS } from '../../lib/theme'
import type { RegisterCredentials } from '../../types/cerberus'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: conectar con cerberus-securitygate auth endpoint
    navigate({ to: '/scans' })
  }

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <h1 style={{ fontFamily: FONTS.sans, fontSize: 26, fontWeight: 600, color: COLORS.ink }}>
        Crea tu cuenta
      </h1>
      <p style={{ margin: '8px 0 26px', fontFamily: FONTS.sans, fontSize: 14.5, lineHeight: 1.5, color: COLORS.textMuted }}>
        Regístrate para acceder al panel de seguridad de Cerberus.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <AuthInput
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <AuthInput
          label="Correo"
          type="email"
          placeholder="tu@dominio.dev"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <AuthInput
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <AuthInput
              label="Confirmar"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              required
            />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer', fontFamily: FONTS.sans, fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => setForm((f) => ({ ...f, acceptTerms: e.target.checked }))}
            style={{ accentColor: COLORS.brand, width: 15, height: 15, marginTop: 1 }}
            required
          />
          Acepto los términos de servicio y la política de datos.
        </label>

        <AuthButton type="submit">Crear cuenta</AuthButton>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontFamily: FONTS.sans, fontSize: 13.5, color: COLORS.textMuted }}>
        ¿Ya tienes cuenta?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onSwitchToLogin()
          }}
          style={{ color: COLORS.brand, textDecoration: 'none', fontWeight: 600 }}
        >
          Entrar
        </a>
      </p>
    </div>
  )
}
