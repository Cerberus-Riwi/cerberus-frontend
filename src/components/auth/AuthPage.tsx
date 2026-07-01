import { LoginForm } from './LoginForm'
import { AuthNavbar } from './AuthNavbar'

export function AuthPage() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: '#04060b',
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      color: '#e9eef8',
      WebkitFontSmoothing: 'antialiased',
      '--accent':  '#22d3ee',
      '--accent2': '#3b82f6',
    } as React.CSSProperties}>
      <video
        autoPlay loop muted playsInline
        style={{ position: 'absolute', inset: 0, zIndex: 1, width: '100%', height: '100%', objectFit: 'cover' }}
        src="/cerberus-bg.mp4"
      />

      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(60% 60% at 25% 55%, rgba(34,211,238,0.14) 0%, transparent 60%)',
      }} />

      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.5,
        backgroundImage: 'linear-gradient(rgba(120,160,220,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,220,0.04) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
        maskImage: 'radial-gradient(80% 80% at 50% 40%, #000 0%, transparent 80%)',
      }} />

      <AuthNavbar mode="login" onSwitch={() => {}} />

      <div style={{
        position: 'absolute',
        top: 80, bottom: 0,
        right: 0, width: '50%',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <LoginForm />
      </div>
    </div>
  )
}
