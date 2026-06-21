import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/compare',  label: 'Compare',  emoji: '💊' },
  { to: '/advisor',  label: 'AI',        emoji: '🤖' },
  { to: '/scanner',  label: 'Scanner',   emoji: '📷' },
  { to: '/history',  label: 'History',   emoji: '🕐' },
  { to: '/alerts',   label: 'Alerts',    emoji: '🔔' },
];

export default function BottomNav() {
  return (
    <nav
      className="mobile-only"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'rgba(2,13,11,0.92)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 -1px 0 rgba(13,148,136,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 'calc(8px + env(safe-area-inset-bottom, 0px)) 0 12px',
        zIndex: 100,
        borderTop: '1px solid rgba(13,148,136,0.1)',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          aria-label={item.label}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: isActive ? 'rgba(13,148,136,0.15)' : 'transparent',
            color: isActive ? '#5EEAD4' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s',
            textDecoration: 'none',
            border: isActive ? '1px solid rgba(13,148,136,0.3)' : '1px solid transparent',
          })}
        >
          {({ isActive }) => (
            <>
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
