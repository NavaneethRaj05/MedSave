import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh + 0px)',  /* overridden by dvh below via CSS var */
        height: '100%',
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
          paddingTop: 2,
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
