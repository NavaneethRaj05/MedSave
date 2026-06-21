import React from 'react';

export default function Spinner({ size = 40, color = 'var(--teal)' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        border: `4px solid var(--teal-light)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto',
      }}
    />
  );
}
