import { useState } from 'react'
import { COLORS, FONTS, RADIUS } from '../../lib/theme'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function AuthInput({ label, ...props }: AuthInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <label style={{ display: 'block' }}>
      <span
        style={{
          display: 'block',
          fontFamily: FONTS.sans,
          fontSize: 13,
          fontWeight: 500,
          color: COLORS.text,
          marginBottom: 7,
        }}
      >
        {label}
      </span>
      <input
        {...props}
        onFocus={(e) => {
          setFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          props.onBlur?.(e)
        }}
        style={{
          width: '100%',
          padding: '11px 13px',
          background: COLORS.surface,
          border: `1px solid ${focused ? COLORS.brand : COLORS.borderStrong}`,
          borderRadius: RADIUS.sm,
          color: COLORS.ink,
          fontFamily: FONTS.sans,
          fontSize: 14.5,
          outline: 'none',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
          boxShadow: focused ? `0 0 0 3px ${COLORS.brandSoft}` : 'none',
        }}
      />
    </label>
  )
}
