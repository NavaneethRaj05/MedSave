import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/compare',  label: 'Compare' },
  { to: '/advisor',  label: 'AI Advisor' },
  { to: '/scanner',  label: 'Scanner' },
  { to: '/history',  label: 'History' },
  { to: '/alerts',   label: 'Alerts' },
];

export default function Header() {
  const navigate = useNavigate();
  return (
    <header
      style={{
        background: 'rgba(2,13,11,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(13,148,136,0.15)',
        padding: '14px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Go to landing page"
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 800,
            background: 'linear-gradient(90deg,#5EEAD4,#0D9488)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 2,
          }}
        >
          💊 MedSave
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          Compare · Save · Know Your Rights
        </p>
      </div>

      {/* Desktop Navigation Links */}
      <nav 
        className="desktop-only" 
        style={{ 
          display: 'flex', 
          gap: 24,
          alignItems: 'center'
        }}
        aria-label="Desktop navigation"
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 600,
              color: isActive ? '#5EEAD4' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              padding: '6px 0',
              borderBottom: isActive ? '2px solid #5EEAD4' : '2px solid transparent',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
