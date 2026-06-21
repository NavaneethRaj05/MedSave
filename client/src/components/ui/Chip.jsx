import React from 'react';

export default function Chip({ children, onClick, active = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        background: active ? 'var(--teal)' : 'var(--teal-light)',
        color: active ? '#fff' : 'var(--teal-dark)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        padding: '5px 13px',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
