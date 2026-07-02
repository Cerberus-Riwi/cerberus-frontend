import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../../lib/api'
import type { ChatFinding } from '../../lib/api'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface Props {
  findings?: ChatFinding[]
}

export function ChatWidget({ findings }: Props) {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)

    try {
      const res = await sendChatMessage(text, findings)
      setMessages(prev => [...prev, { role: 'assistant', text: res.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error al conectar con el asistente. Verificá la configuración de Azure OpenAI.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 88, right: 28, zIndex: 200,
          width: 340, height: 480,
          background: '#0c1220',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(139,92,246,0.08)',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e9eef8', letterSpacing: '0.04em' }}>
                Asistente de seguridad
              </div>
              <div style={{ fontSize: 11, color: '#a78bfa', marginTop: 2 }}>
                {findings?.length ? `${findings.length} hallazgos en contexto` : 'Sin hallazgos — modo general'}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#7e90ad', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}
            >
              ×
            </button>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.length === 0 && (
              <div style={{ color: '#4a5a74', fontSize: 13, textAlign: 'center', marginTop: 40, lineHeight: 1.7 }}>
                Preguntame sobre los hallazgos,<br />
                su gravedad o cómo corregirlos.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.05)',
                  border: m.role === 'user' ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  fontSize: 13,
                  color: '#dde4f0',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '9px 16px', borderRadius: '12px 12px 12px 2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <ThinkingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Preguntá algo..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '9px 12px',
                background: 'rgba(4,6,11,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#e9eef8',
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                padding: '9px 14px',
                background: loading || !input.trim() ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.8)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: 15,
                transition: 'background 0.15s',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Asistente de seguridad"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 200,
          width: 52, height: 52,
          borderRadius: '50%',
          background: open ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.75)',
          border: '1px solid rgba(139,92,246,0.5)',
          boxShadow: '0 4px 24px rgba(139,92,246,0.35)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          transition: 'background 0.15s, transform 0.15s',
          transform: open ? 'scale(0.94)' : 'scale(1)',
        }}
      >
        {open ? '×' : '✦'}
      </button>
    </>
  )
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 16 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#a78bfa',
          animation: 'blink 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  )
}
