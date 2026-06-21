import React from 'react';

export default function SummaryBox({ summary, impact }) {
  return (
    <div
      style={{
        background: 'var(--purple-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        marginBottom: 14,
        borderLeft: '4px solid var(--purple)',
      }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--purple)', marginBottom: 8 }}>
        📋 Project Summary
      </h3>
      <p style={{ fontSize: 13, color: '#4C1D95', lineHeight: 1.6 }}>
        {summary}
      </p>
      {impact && (
        <p style={{ fontSize: 12, color: 'var(--purple-dark)', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
          💥 {impact}
        </p>
      )}
    </div>
  );
}
