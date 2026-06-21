import React from 'react';

const variants = {
  best:    { bg: 'var(--green-light)',    color: '#15803D' },
  govt:    { bg: '#DBEAFE',              color: '#1D4ED8' },
  mrp:     { bg: 'var(--red-light)',      color: '#B91C1C' },
  disc:    { bg: 'var(--amber-light)',    color: '#854D0E' },
  high:    { bg: 'var(--red-light)',      color: '#B91C1C' },
  medium:  { bg: 'var(--amber-light)',    color: '#854D0E' },
  low:     { bg: 'var(--green-light)',    color: '#15803D' },
  grey:    { bg: '#F3F4F6',              color: '#6B7280' },
  purple:  { bg: 'var(--purple-light)',   color: 'var(--purple-dark)' },
  triggered: { bg: 'var(--green-light)', color: '#15803D' },
};

export default function Badge({ variant = 'grey', children }) {
  const style = variants[variant] || variants.grey;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '8px',
        background: style.bg,
        color: style.color,
        fontFamily: 'var(--font-display)',
      }}
    >
      {children}
    </span>
  );
}
