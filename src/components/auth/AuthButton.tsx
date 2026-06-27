interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function AuthButton({ children, style, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      style={{
        width: '100%',
        marginTop: 6,
        padding: '15px',
        border: 'none',
        borderRadius: 12,
        cursor: 'pointer',
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#04060b',
        background: 'linear-gradient(100deg, var(--accent), var(--accent2))',
        transition: 'filter 0.25s ease, transform 0.25s ease',
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
    >
      {children}
    </button>
  )
}
