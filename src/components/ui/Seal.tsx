interface SealProps {
  size?: number
  color?: string
  /** grosor del trazo */
  weight?: number
}

/**
 * Sello del Cerbero — marca del producto.
 * Escudo (guardián) con tres trazos verticales: las tres cabezas.
 * Monocromo: hereda el color del contexto donde se usa.
 */
export function Seal({ size = 28, color = 'currentColor', weight = 2 }: SealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Cerberus"
      style={{ display: 'block' }}
    >
      <path
        d="M16 3.2 L26.5 7 V15.5 C26.5 22.4 22 26.7 16 28.8 C10 26.7 5.5 22.4 5.5 15.5 V7 Z"
        stroke={color}
        strokeWidth={weight}
        strokeLinejoin="round"
      />
      <path
        d="M12 12.4 V18.6 M16 11.4 V19.6 M20 12.4 V18.6"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
      />
    </svg>
  )
}
