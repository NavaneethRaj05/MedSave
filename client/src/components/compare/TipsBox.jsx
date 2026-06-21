import React from 'react';

export default function TipsBox({ tips }) {
  if (!tips || tips.length === 0) return null;
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 16,
      }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        💊 Smart Buying Tips
      </h3>
      {tips.map((tip, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 10,
            padding: '7px 0',
            borderBottom: i < tips.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--text-muted)',
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
          <span>{tip}</span>
        </div>
      ))}
    </div>
  );
}
