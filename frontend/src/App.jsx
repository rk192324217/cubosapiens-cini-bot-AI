import React, { useEffect, useRef } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Message from './components/Message'
import InputBar from './components/InputBar'
import { useChat } from './hooks/useChat'

export default function App() {
  const { messages, loading, error, send, reset } = useChat()
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      maxWidth: '860px',
      margin: '0 auto',
      background: 'var(--bg-void)',
    }}>
      <Header onReset={reset} />

      {/* Message area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <Welcome onSuggest={send} />
        ) : (
          <div style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {messages.map(m => (
              <Message key={m.id} role={m.role} content={m.content} />
            ))}

            {/* Typing indicator */}
            {loading && (
              <Message role="bot" content="" isTyping />
            )}

            {/* Error banner */}
            {error && (
              <div style={{
                background: 'rgba(220,60,60,0.1)',
                border: '1px solid rgba(220,60,60,0.3)',
                borderRadius: 'var(--radius)',
                padding: '10px 16px',
                fontSize: '13px',
                color: '#e06060',
              }}>
                ⚠ {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <InputBar onSend={send} disabled={loading} />
    </div>
  )
}
