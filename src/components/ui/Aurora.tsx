interface AuroraProps {
  /** 'app' = sutil sobre fondo claro · 'auth' = vibrante sobre panel oscuro */
  variant?: 'app' | 'auth'
  /** fija a viewport (app) o cubre el contenedor relativo (auth) */
  fixed?: boolean
}

/**
 * Fondo aurora: manchas de degradado desenfocadas en deriva lenta.
 * Da profundidad y vida sin distraer. pointer-events: none.
 */
export function Aurora({ variant = 'app', fixed = true }: AuroraProps) {
  const app = variant === 'app'

  const blobs = app
    ? [
        { c: 'rgba(99,102,241,0.18)', top: '-10%', left: '-5%', size: 540, anim: 'cb-aurora-1 18s ease-in-out infinite' },
        { c: 'rgba(139,92,246,0.16)', top: '20%', left: '60%', size: 600, anim: 'cb-aurora-2 22s ease-in-out infinite' },
        { c: 'rgba(34,211,238,0.12)', top: '65%', left: '10%', size: 460, anim: 'cb-aurora-1 26s ease-in-out infinite' },
      ]
    : [
        { c: 'rgba(99,102,241,0.55)', top: '-15%', left: '-10%', size: 460, anim: 'cb-aurora-1 16s ease-in-out infinite' },
        { c: 'rgba(139,92,246,0.45)', top: '40%', left: '50%', size: 520, anim: 'cb-aurora-2 20s ease-in-out infinite' },
        { c: 'rgba(34,211,238,0.30)', top: '70%', left: '0%', size: 380, anim: 'cb-aurora-1 24s ease-in-out infinite' },
      ]

  return (
    <div
      aria-hidden
      style={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${b.c} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animation: b.anim,
          }}
        />
      ))}
    </div>
  )
}
