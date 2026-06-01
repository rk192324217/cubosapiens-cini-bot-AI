import React, { useState, useRef, useEffect } from 'react'

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }, [value])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <div style={{
      padding: '16px 24px 20px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-deep)',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 14px',
        transition: 'border-color 0.15s',
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about any movie, series, actor, director..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: 1.6,
            resize: 'none',
            outline: 'none',
            maxHeight: '140px',
            overflowY: 'auto',
          }}
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          style={{
            width: '34px', height: '34px',
            borderRadius: '8px',
            background: value.trim() && !disabled ? 'var(--accent)' : 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: value.trim() && !disabled ? '#000' : 'var(--text-muted)',
            fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
            cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
          }}
        >
          {disabled ? (
            <span style={{
              width: '14px', height: '14px',
              border: '2px solid transparent',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : '↑'}
        </button>
      </div>
      <p style={{
        textAlign: 'center',
        fontSize: '11px',
        color: 'var(--text-muted)',
        marginTop: '8px',
      }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
