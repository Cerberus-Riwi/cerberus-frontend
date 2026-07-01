interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function AuthButton({ children, style, disabled, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        width: '100%',
        marginTop: 6,
        padding: '15px',
        border: 'none',
        borderRadius: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#04060b',
        background: 'linear-gradient(100deg, var(--accent), var(--accent2))',
        transition: 'filter 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: '0 8px 20px rgba(34, 211, 238, 0.2), 0 4px 8px rgba(139, 92, 246, 0.15)',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...style,
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.filter = 'brightness(1.15) saturate(1.1)'
        e.currentTarget.style.transform = 'perspective(1000px) translateY(-4px) translateZ(12px)'
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(34, 211, 238, 0.35), 0 8px 16px rgba(139, 92, 246, 0.2)'
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.filter = ''
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 211, 238, 0.2), 0 4px 8px rgba(139, 92, 246, 0.15)'
      }}
    >
      {children}
    </button>
  )
}
