import React from 'react'

export default function Header({ onReset }) {
  return (
    <header style={{
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-deep)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--accent)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
        }}>🎬</div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          letterSpacing: '0.1em',
          color: 'var(--text-primary)',
        }}>CINEAI</span>
        <span style={{
          fontSize: '11px',
          color: 'var(--accent)',
          background: 'var(--accent-glow)',
          border: '1px solid var(--border-accent)',
          borderRadius: '4px',
          padding: '2px 8px',
          letterSpacing: '0.05em',
        }}>BETA</span>
      </div>

      <button
        onClick={onReset}
        title="New conversation"
        style={{
          color: 'var(--text-secondary)',
          fontSize: '13px',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          background: 'transparent',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.target.style.color = 'var(--text-primary)'
          e.target.style.borderColor = 'var(--border-accent)'
        }}
        onMouseLeave={e => {
          e.target.style.color = 'var(--text-secondary)'
          e.target.style.borderColor = 'var(--border)'
        }}
      >
        ↺ New chat
      </button>
    </header>
  )
}
