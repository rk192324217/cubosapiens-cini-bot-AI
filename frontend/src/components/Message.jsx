import React from 'react'
import ReactMarkdown from 'react-markdown'

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '4px 0' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: '7px', height: '7px',
          borderRadius: '50%',
          background: 'var(--accent)',
          animation: 'pulse 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
          display: 'inline-block',
        }} />
      ))}
    </div>
  )
}

export default function Message({ role, content, isTyping }) {
  const isBot = role === 'bot'

  return (
    <div style={{
      display: 'flex',
      flexDirection: isBot ? 'row' : 'row-reverse',
      gap: '12px',
      alignItems: 'flex-start',
      animation: 'fadeUp 0.25s ease',
      maxWidth: '100%',
    }}>
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px',
        borderRadius: isBot ? '8px' : '50%',
        background: isBot ? 'var(--accent)' : 'var(--bg-surface)',
        border: isBot ? 'none' : '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '15px',
        flexShrink: 0,
      }}>
        {isBot ? '🎬' : '👤'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: 'min(75%, 600px)',
        background: isBot ? 'var(--bg-card)' : 'var(--bg-surface)',
        border: `1px solid ${isBot ? 'var(--border)' : 'var(--border)'}`,
        borderRadius: isBot
          ? '4px 14px 14px 14px'
          : '14px 4px 14px 14px',
        padding: '12px 16px',
        fontSize: '14px',
        lineHeight: 1.65,
        color: 'var(--text-primary)',
        fontWeight: 300,
      }}>
        {isTyping
          ? <TypingDots />
          : <div className="prose"><ReactMarkdown>{content}</ReactMarkdown></div>
        }
      </div>
    </div>
  )
}
