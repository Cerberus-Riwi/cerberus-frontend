import { useId } from 'react'
import type { Verdict } from '../../types/cerberus'
import { VERDICT_META } from '../../lib/theme'

interface GateProps {
  verdict: Verdict
  /** lado del cuadro en px */
  size?: number
  /** anima el sello/haz (solo en el hero) */
  animated?: boolean
}

// Apertura de las hojas según el estado de la puerta.
const OPENNESS: Record<Verdict, number> = { fail: 0, warning: 0.34, pass: 1 }

/**
 * The Gate — elemento firma del dashboard.
 * El Cerbero guarda la puerta: sellada (fail), entreabierta (warning), abierta (pass).
 * Las tres marcas del dintel evocan las tres cabezas del guardián.
 */
export function Gate({ verdict, size = 220, animated = false }: GateProps) {
  const uid = useId().replace(/[:]/g, '')
  const meta = VERDICT_META[verdict]
  const o = OPENNESS[verdict]

  // Geometría base (viewBox 200×240). Las hojas se retraen hacia los pilares.
  const leafShift = o * 42
  const beamOpacity = 0.12 + o * 0.6

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      role="img"
      aria-label={`Puerta del veredicto: ${meta.label.toLowerCase()}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={meta.accent} />
          <stop offset="100%" stopColor={meta.accent2} />
        </linearGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={meta.accent} stopOpacity="0" />
          <stop offset="45%" stopColor={meta.accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={meta.accent2} stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Haz de luz que cruza la puerta — intensidad según apertura */}
      <rect
        x="80"
        y="40"
        width="40"
        height="170"
        fill={`url(#beam-${uid})`}
        opacity={beamOpacity}
        style={
          animated && o > 0.5
            ? { animation: 'cb-scan-sweep 3.2s ease-in-out infinite' }
            : undefined
        }
      />

      {/* Umbral inferior */}
      <rect x="36" y="206" width="128" height="10" rx="3" fill={`url(#grad-${uid})`} opacity="0.85" />

      {/* Pilares */}
      <rect x="36" y="40" width="20" height="170" rx="5" fill={`url(#grad-${uid})`} />
      <rect x="144" y="40" width="20" height="170" rx="5" fill={`url(#grad-${uid})`} />

      {/* Hojas de la puerta — se separan según el estado */}
      <g>
        <rect
          x="58"
          y="48"
          width="42"
          height="158"
          rx="3"
          fill={meta.accent2}
          opacity="0.16"
          stroke={meta.accent}
          strokeWidth="1.5"
          strokeOpacity="0.5"
          transform={`translate(${-leafShift} 0)`}
          style={{ transition: 'transform 0.8s cubic-bezier(.76,0,.24,1)' }}
        />
        <rect
          x="100"
          y="48"
          width="42"
          height="158"
          rx="3"
          fill={meta.accent2}
          opacity="0.16"
          stroke={meta.accent}
          strokeWidth="1.5"
          strokeOpacity="0.5"
          transform={`translate(${leafShift} 0)`}
          style={{ transition: 'transform 0.8s cubic-bezier(.76,0,.24,1)' }}
        />
      </g>

      {/* Dintel — tres cabezas del Cerbero */}
      <rect x="30" y="28" width="140" height="16" rx="5" fill={`url(#grad-${uid})`} />
      {[70, 100, 130].map((cx) => (
        <circle key={cx} cx={cx} cy={36} r={3.4} fill={COLORS_OBSIDIAN} />
      ))}

      {/* Sello central — visible cuando la puerta no está abierta */}
      {o < 0.9 && (
        <g
          filter={`url(#glow-${uid})`}
          opacity={1 - o}
          style={
            animated && verdict === 'fail'
              ? { animation: 'cb-seal-pulse 2.4s ease-in-out infinite' }
              : undefined
          }
        >
          <circle cx="100" cy="126" r="22" fill="none" stroke={meta.accent} strokeWidth="2.5" />
          <path
            d="M100 112 L100 140 M88 126 L112 126"
            stroke={meta.accent}
            strokeWidth="3"
            strokeLinecap="round"
            transform={verdict === 'fail' ? 'rotate(45 100 126)' : undefined}
          />
        </g>
      )}
    </svg>
  )
}

const COLORS_OBSIDIAN = '#04060b'
