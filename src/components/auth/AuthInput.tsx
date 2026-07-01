import { useState } from 'react'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function AuthInput({ label, ...props }: AuthInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.16em',
        color: '#7e90ad',
        textTransform: 'uppercase',
        marginBottom: 9,
        textShadow: '0 2px 4px rgba(34, 211, 238, 0.1)',
      }}>
        {label}
      </label>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
        style={{
          width: '100%',
          padding: '13px 16px',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? 'var(--accent)' : 'rgba(120,160,220,0.18)'}`,
          borderRadius: 12,
          color: '#e9eef8',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 15,
          outline: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
          boxShadow: focused 
            ? '0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent), 0 8px 24px rgba(34, 211, 238, 0.15), inset 0 2px 4px rgba(255,255,255,0.05)' 
            : '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.03)',
          transform: focused ? 'perspective(1000px) translateZ(8px) rotateX(2deg)' : 'perspective(1000px) translateZ(2px)',
        }}
      />
    </div>
  )
}
