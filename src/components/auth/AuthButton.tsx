import { COLORS, FONTS, RADIUS } from '../../lib/theme'

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function AuthButton({ children, style, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      style={{
        width: '100%',
        marginTop: 4,
        padding: '12px 16px',
        border: 'none',
        borderRadius: RADIUS.sm,
        cursor: 'pointer',
        fontFamily: FONTS.sans,
        fontWeight: 600,
        fontSize: 14.5,
        color: '#fff',
        background: COLORS.brand,
        transition: 'background 0.18s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.brandHover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.brand
      }}
    >
      {children}
    </button>
  )
}
