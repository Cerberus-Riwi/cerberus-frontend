import { useState } from 'react'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'
import type { RegisterCredentials } from '../../types/cerberus'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
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
    console.log('register:', form)
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
        // forja tu identidad
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
        Crea<br />tu cuenta
      </h1>

      <p style={{ margin: '14px 0 28px', fontSize: 15, lineHeight: 1.55, color: '#9fb0cc' }}>
        Enciende la chispa. Únete y deja que el guardián vigile por ti.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <AuthInput
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={form.name}
          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />

        <AuthInput
          label="Correo"
          type="email"
          placeholder="tu@dominio.dev"
          value={form.email}
          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />

        {/* Password row — dos columnas */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <AuthInput
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <AuthInput
              label="Confirmar"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
            />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer', fontSize: 13, color: '#9fb0cc', marginTop: 2 }}>
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => setForm(f => ({ ...f, acceptTerms: e.target.checked }))}
            style={{ accentColor: 'var(--accent)', width: 15, height: 15, marginTop: 1 }}
            required
          />
          Acepto el pacto del guardián y la política de datos.
        </label>

        <AuthButton type="submit">Crear cuenta</AuthButton>
      </form>

      <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#7e90ad' }}>
        ¿Ya tienes cuenta?{' '}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onSwitchToLogin() }}
          style={{ color: '#e9eef8', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: 1 }}
        >
          Entrar
        </a>
      </div>
    </div>
  )
}
