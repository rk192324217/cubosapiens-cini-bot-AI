import React from 'react'

const SUGGESTIONS = [
  { icon: '🏆', label: 'Best of 2024', query: 'What are the best movies and series of 2024?' },
  { icon: '🎭', label: 'Nolan ranked', query: 'Rank all Christopher Nolan films from best to worst with reasons' },
  { icon: '🌏', label: 'Korean cinema', query: 'Best Korean films and dramas I should watch right now' },
  { icon: '😱', label: 'Hidden horrors', query: 'Most underrated horror films that genuinely scared audiences' },
  { icon: '🚀', label: 'Sci-fi essentials', query: 'Essential sci-fi films every movie lover must watch' },
  { icon: '💔', label: 'Emotional dramas', query: 'Films that will make me cry — the most emotionally powerful dramas' },
]

export default function Welcome({ onSuggest }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: '32px',
      animation: 'fadeUp 0.5s ease',
    }}>
      {/* Hero text */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          letterSpacing: '0.08em',
          color: 'var(--text-primary)',
          lineHeight: 1,
          marginBottom: '12px',
        }}>
          YOUR MOVIE BRAIN
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          fontWeight: 300,
          maxWidth: '380px',
          lineHeight: 1.6,
        }}>
          Ask anything about films, series, actors, directors — or let me pick something perfect for you.
        </p>
      </div>

      {/* Suggestion grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        width: '100%',
        maxWidth: '680px',
      }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            onClick={() => onSuggest(s.query)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              textAlign: 'left',
              color: 'var(--text-primary)',
              transition: 'all 0.15s',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-accent)'
              e.currentTarget.style.background = 'var(--bg-surface)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--bg-card)'
            }}
          >
            <span style={{ fontSize: '20px' }}>{s.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 400 }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
